/**
 * Clear Timer - Precision Aesthetic Stopwatch & Countdown Timer
 * Features:
 * - Multi-Class & Team Scoreboard Management (Classes with isolated team rosters & times)
 * - 6 Modular Design-Token Aesthetic Skins:
 *   1. Executive Monochrome (Slate/White/Minimalist)
 *   2. Retro Terminal (Vintage Monospace/Phosphor Green/CRT Scanlines)
 *   3. Cyberpunk Neon (Midnight Obsidian/Cyan/Magenta Glow)
 *   4. Warm Studio / Paper (Soft Cream/Espresso/Terracotta Tactile)
 *   5. Deep Ocean (Abyssal Navy/Deep Teal/Aqua Glow)
 *   6. Solarized Sunset (Plum-Indigo/Coral/Gold Glassmorphism)
 * - 100% Reclaimed Viewport Layout for Maximum Numeral Scale
 * - Instant Live Skin Switching with Sticky LocalStorage Persistence
 * - High-Precision RequestAnimationFrame Timing Loop
 * - Privacy Vault Shield & Voice Countdown
 */

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { ShortcutGuide } from './components/ShortcutGuide';
import { CountdownOverlay } from './components/CountdownOverlay';
import { ScoreboardModal } from './components/ScoreboardModal';
import { TermsModal } from './components/TermsModal';
import { SkinSelector } from './components/SkinSelector';
import { AuthButton } from './components/AuthButton';
import { SKINS, DEFAULT_SKIN_ID, SkinId } from './theme/skins';
import { TimerStatus, Team, Classroom } from './types';
import { playSound } from './utils/audio';
import type { User } from 'firebase/auth';
import {
  signInWithGoogle,
  logoutUser,
  subscribeToAuthChanges,
} from './firebase/auth';
import { saveClassesToCloud, loadClassesFromCloud } from './firebase/classes';

/**
 * Saved Sessions is loaded on demand to keep initial bundle cost low.
 */
const SessionsModal = lazy(() =>
  import('./components/SessionsModal').then((m) => ({ default: m.SessionsModal })),
);

export default function App() {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [isCovered, setIsCovered] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [countdownEnabled, setCountdownEnabled] = useState<boolean>(true);
  const [showSessionsModal, setShowSessionsModal] = useState<boolean>(false);
  const [showScoreboardModal, setShowScoreboardModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [termsInitialTab, setTermsInitialTab] = useState<'terms' | 'privacy' | 'coppa' | 'erasure'>('terms');

  // Design-Token Skin Switcher State
  const [skinId, setSkinId] = useState<SkinId>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_skin');
      if (saved && saved in SKINS) return saved as SkinId;
    } catch {}
    return DEFAULT_SKIN_ID;
  });

  const activeTokens = SKINS[skinId] || SKINS[DEFAULT_SKIN_ID];

  /**
   * Optional target duration the timer counts toward, in minutes.
   * `null` means the timer runs as an open-ended stopwatch.
   */
  const [targetMinutes, setTargetMinutes] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_target');
      if (saved === 'none') return null;
      if (saved) {
        const parsed = Number(saved);
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
      }
    } catch {}
    return null;
  });

  // Sticky skin persistence and document attribute binding
  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_skin', skinId);
      document.documentElement.dataset.skin = skinId;
      document.documentElement.dataset.theme = activeTokens.isDark ? 'dark' : 'light';
      document.title = `Clear Timer — ${activeTokens.name}`;
    } catch {}
  }, [skinId, activeTokens]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'clear_timer_target',
        targetMinutes === null ? 'none' : String(targetMinutes),
      );
    } catch {}
  }, [targetMinutes]);

  // Hierarchical Classroom Management State (Persisted in localStorage)
  const [classes, setClasses] = useState<Classroom[]>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migrate from legacy clear_timer_teams if available
      const legacy = localStorage.getItem('clear_timer_teams');
      const legacyTeams: Team[] = legacy
        ? JSON.parse(legacy)
        : [
            { id: 'team-1', name: 'Team Alpha', timeMs: 0 },
            { id: 'team-2', name: 'Team Beta', timeMs: 0 },
          ];
      return [
        {
          id: 'class-1',
          name: 'Class 1',
          teams: legacyTeams,
          createdAt: Date.now(),
        },
      ];
    } catch {}
    return [
      {
        id: 'class-1',
        name: 'Class 1',
        teams: [
          { id: 'team-1', name: 'Team Alpha', timeMs: 0 },
          { id: 'team-2', name: 'Team Beta', timeMs: 0 },
        ],
        createdAt: Date.now(),
      },
    ];
  });

  const [activeClassId, setActiveClassId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_active_class_id');
      if (saved) return saved;
    } catch {}
    return 'class-1';
  });

  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_active_class_id', activeClassId);
    } catch {}
  }, [activeClassId]);

  // Google Authentication & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const cloudClasses = await loadClassesFromCloud(user.uid);
          if (cloudClasses && cloudClasses.length > 0) {
            setClasses(cloudClasses);
            setActiveClassId((prev) =>
              cloudClasses.some((c) => c.id === prev)
                ? prev
                : cloudClasses[0].id,
            );
          } else {
            // First time this user signs in: back up current local classes to cloud
            await saveClassesToCloud(user.uid, classes);
          }
        } catch (err) {
          console.warn('Error syncing classes on sign in:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to Cloud whenever classes change and user is logged in
  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_classes', JSON.stringify(classes));
    } catch {}

    if (currentUser) {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      setIsSyncing(true);
      syncTimeoutRef.current = setTimeout(async () => {
        await saveClassesToCloud(currentUser.uid, classes);
        setIsSyncing(false);
      }, 500);
    }
  }, [classes, currentUser]);

  const handleSignIn = useCallback(async () => {
    try {
      setIsSyncing(true);
      const user = await signInWithGoogle();
      if (user) {
        const cloudClasses = await loadClassesFromCloud(user.uid);
        if (cloudClasses && cloudClasses.length > 0) {
          setClasses(cloudClasses);
          setActiveClassId((prev) =>
            cloudClasses.some((c) => c.id === prev)
              ? prev
              : cloudClasses[0].id,
          );
        } else {
          await saveClassesToCloud(user.uid, classes);
        }
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [classes]);

  const handleSignOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  }, []);

  // Classroom action handlers
  const handleAddClass = useCallback((name: string) => {
    const newClass: Classroom = {
      id: `class-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      teams: [
        { id: `team-1-${Date.now()}`, name: 'Team 1', timeMs: 0 },
        { id: `team-2-${Date.now()}`, name: 'Team 2', timeMs: 0 },
      ],
      createdAt: Date.now(),
    };
    setClasses((prev) => [...prev, newClass]);
    setActiveClassId(newClass.id);
  }, []);

  const handleRenameClass = useCallback((classId: string, name: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, name } : c)),
    );
  }, []);

  const handleRemoveClass = useCallback(
    (classId: string) => {
      setClasses((prev) => {
        if (prev.length <= 1) return prev;
        const filtered = prev.filter((c) => c.id !== classId);
        return filtered;
      });
      setActiveClassId((prevActive) => {
        if (prevActive === classId) {
          const remaining = classes.filter((c) => c.id !== classId);
          return remaining[0]?.id || 'class-1';
        }
        return prevActive;
      });
    },
    [classes],
  );

  const handleSelectClass = useCallback((classId: string) => {
    setActiveClassId(classId);
  }, []);

  // Team action handlers (scoped to specific class)
  const handleAddTeam = useCallback((classId: string, teamName: string) => {
    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: teamName,
      timeMs: 0,
    };
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, teams: [...c.teams, newTeam] } : c,
      ),
    );
  }, []);

  const handleRemoveTeam = useCallback((classId: string, teamId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, teams: c.teams.filter((t) => t.id !== teamId) }
          : c,
      ),
    );
  }, []);

  const handleSetTeamTime = useCallback(
    (classId: string, teamId: string, timeMs: number) => {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === classId
            ? {
                ...c,
                teams: c.teams.map((t) =>
                  t.id === teamId ? { ...t, timeMs: Math.max(0, timeMs) } : t,
                ),
              }
            : c,
        ),
      );
    },
    [],
  );

  const handleAdjustTeamTime = useCallback(
    (classId: string, teamId: string, deltaMs: number) => {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === classId
            ? {
                ...c,
                teams: c.teams.map((t) =>
                  t.id === teamId
                    ? { ...t, timeMs: Math.max(0, t.timeMs + deltaMs) }
                    : t,
                ),
              }
            : c,
        ),
      );
    },
    [],
  );

  const handleResetClassTimes = useCallback((classId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, teams: c.teams.map((t) => ({ ...t, timeMs: 0 })) }
          : c,
      ),
    );
  }, []);

  // Current active class lookup
  const activeClass =
    classes.find((c) => c.id === activeClassId) || classes[0];
  const activeTeamsCount = activeClass?.teams.length || 0;

  // Precise time refs
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const statusRef = useRef<TimerStatus>(status);
  statusRef.current = status;

  const isCoveredRef = useRef<boolean>(isCovered);
  isCoveredRef.current = isCovered;

  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const countdownEnabledRef = useRef<boolean>(countdownEnabled);
  countdownEnabledRef.current = countdownEnabled;

  // High-precision animation frame timer loop
  const updateTimer = useCallback(() => {
    const now = performance.now();
    const currentElapsed =
      accumulatedTimeRef.current + (now - startTimeRef.current);
    setElapsedMs(currentElapsed);
    animFrameIdRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const startTicking = useCallback(() => {
    startTimeRef.current = performance.now();
    setStatus('running');
    playSound('start', soundEnabledRef.current);
    animFrameIdRef.current = requestAnimationFrame(updateTimer);
  }, [updateTimer]);

  const initiateStart = useCallback(() => {
    if (statusRef.current === 'idle' && countdownEnabledRef.current) {
      setStatus('countdown');
    } else {
      startTicking();
    }
  }, [startTicking]);

  const handleCountdownComplete = useCallback(() => {
    startTicking();
  }, [startTicking]);

  const handleCountdownCancel = useCallback(() => {
    setStatus('idle');
    playSound('reset', soundEnabledRef.current);
  }, []);

  const pauseTimer = useCallback(() => {
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    const now = performance.now();
    accumulatedTimeRef.current += now - startTimeRef.current;
    setElapsedMs(accumulatedTimeRef.current);
    setStatus('paused');
    playSound('stop', soundEnabledRef.current);
  }, []);

  const toggleStartStop = useCallback(() => {
    if (statusRef.current === 'running') {
      pauseTimer();
    } else if (statusRef.current === 'countdown') {
      handleCountdownCancel();
    } else {
      initiateStart();
    }
  }, [pauseTimer, handleCountdownCancel, initiateStart]);

  const resetTimer = useCallback(() => {
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    setElapsedMs(0);
    setStatus('idle');
    playSound('reset', soundEnabledRef.current);
  }, []);

  const toggleCover = useCallback(() => {
    setIsCovered((prev) => {
      const next = !prev;
      playSound('cover', soundEnabledRef.current);
      return next;
    });
  }, []);

  // Fanfare trigger on block completion
  const targetMs = targetMinutes !== null ? targetMinutes * 60000 : 0;
  const targetReached = targetMs > 0 && elapsedMs >= targetMs;
  const announcedTargetRef = useRef<boolean>(false);

  useEffect(() => {
    if (!targetReached) {
      announcedTargetRef.current = false;
      return;
    }
    if (!announcedTargetRef.current) {
      announcedTargetRef.current = true;
      playSound('celebrate', soundEnabledRef.current);
    }
  }, [targetReached]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleStartStop();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        toggleCover();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleStartStop, toggleCover, resetTimer]);

  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  /** Human-readable status announced politely to assistive tech */
  const statusLabel =
    status === 'running'
      ? 'Timer running'
      : status === 'countdown'
      ? 'Countdown starting'
      : status === 'paused'
      ? 'Timer paused'
      : 'Timer ready';

  const isBracket = !!activeTokens.buttons.bracketStyle;

  return (
    <main
      id="timer-app-root"
      style={activeTokens.canvas.style}
      className={`h-dvh w-full overflow-hidden flex flex-col gap-2 p-3 sm:p-5 select-none transition-colors duration-300 ${activeTokens.canvas.bg} ${activeTokens.canvas.text}`}
    >
      {/* Accessibility live region */}
      <p aria-live="polite" className="sr-only">
        {statusLabel}
        {isCovered ? ', display covered' : ''}
      </p>

      {/* 5-Second Countdown Overlay */}
      <AnimatePresence>
        {status === 'countdown' && (
          <CountdownOverlay
            soundEnabled={soundEnabled}
            tokens={activeTokens}
            onComplete={handleCountdownComplete}
            onCancel={handleCountdownCancel}
          />
        )}
      </AnimatePresence>

      {/* Multi-Class & Team Scoreboard Modal */}
      <AnimatePresence>
        {showScoreboardModal && (
          <ScoreboardModal
            classes={classes}
            activeClassId={activeClassId}
            currentElapsedMs={elapsedMs}
            tokens={activeTokens}
            user={currentUser}
            onSignIn={handleSignIn}
            onSelectClass={handleSelectClass}
            onAddClass={handleAddClass}
            onRenameClass={handleRenameClass}
            onRemoveClass={handleRemoveClass}
            onAddTeam={handleAddTeam}
            onRemoveTeam={handleRemoveTeam}
            onSetTeamTime={handleSetTeamTime}
            onAdjustTeamTime={handleAdjustTeamTime}
            onResetClassTimes={handleResetClassTimes}
            onClose={() => setShowScoreboardModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Firebase Saved Sessions Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {showSessionsModal && (
            <SessionsModal
              currentElapsedMs={elapsedMs}
              tokens={activeTokens}
              onClose={() => setShowSessionsModal(false)}
            />
          )}
        </AnimatePresence>
      </Suspense>

      {/* Terms & Conditions / Regulatory Compliance Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <TermsModal
            tokens={activeTokens}
            initialTab={termsInitialTab}
            onClose={() => setShowTermsModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Top Header: Brand Identity & Modular Skin Switcher */}
      <header className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex flex-col">
            <div
              className={`w-full h-1.5 rounded-full mb-0.5 transition-all ${activeTokens.accent.ruleBg}`}
            />
            <div className="flex items-baseline gap-1.5 px-1">
              <span
                className={`font-black text-2xl sm:text-3xl tracking-tight transition-colors ${activeTokens.accent.color}`}
              >
                clear
              </span>
              <span className="font-bold text-xl sm:text-2xl tracking-tight">
                timer
              </span>
            </div>
            <div
              className={`w-full h-1.5 rounded-full mt-0.5 transition-all ${activeTokens.accent.ruleBg}`}
            />
          </div>

          {/* Mobile Cover active badge */}
          {isCovered && (
            <div
              className={`md:hidden flex items-center gap-1 px-2.5 py-1 ${activeTokens.buttons.pillRounded} text-xs font-bold shadow-sm ${activeTokens.accent.badgeBg} ${activeTokens.accent.badgeText}`}
            >
              <span>Covered</span>
            </div>
          )}
        </div>

        {/* Modular Design-Token Skin Switcher */}
        <div className="flex items-center justify-center max-w-full">
          <SkinSelector
            currentSkin={skinId}
            onSelectSkin={setSkinId}
            tokens={activeTokens}
          />
        </div>

        {/* Right Header Controls: Cover Indicator, Active Class Team Quick Trigger, and Auth Profile */}
        <div className="flex items-center gap-2">
          {isCovered && (
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 ${activeTokens.buttons.pillRounded} text-xs font-bold shadow-sm ${activeTokens.accent.badgeBg} ${activeTokens.accent.badgeText} border ${activeTokens.accent.badgeBorder}`}
            >
              <span>Cover active</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowScoreboardModal(true)}
            title={`Active Class: ${activeClass?.name || 'Class 1'} with ${activeTeamsCount} teams`}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 ${activeTokens.buttons.pillRounded} text-xs font-bold transition-all cursor-pointer ${activeTokens.buttons.secondary}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isBracket
                ? `[ ${activeClass?.name.toUpperCase() || 'CLASS'}: TEAMS (${activeTeamsCount}) ]`
                : `${activeClass?.name || 'Class'}: Teams (${activeTeamsCount})`}
            </span>
            <span className="sm:hidden">
              {activeClass?.name || 'Class'} ({activeTeamsCount})
            </span>
          </button>

          <AuthButton
            user={currentUser}
            isSyncing={isSyncing}
            tokens={activeTokens}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        </div>
      </header>

      {/* Main Content Region: Reclaimed 100% for TimerDisplay */}
      <section
        aria-label="Digital Timer Display"
        className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col"
      >
        <TimerDisplay
          elapsedMs={elapsedMs}
          status={status}
          isCovered={isCovered}
          tokens={activeTokens}
          targetMinutes={targetMinutes}
          onToggleCover={toggleCover}
          onToggleStartStop={toggleStartStop}
        />
      </section>

      {/* Bottom Bar: Action Controls & Hotkeys */}
      <footer className="w-full max-w-5xl mx-auto shrink-0 flex flex-col gap-2">
        <TimerControls
          status={status}
          isCovered={isCovered}
          soundEnabled={soundEnabled}
          countdownEnabled={countdownEnabled}
          tokens={activeTokens}
          onToggleStartStop={toggleStartStop}
          onToggleCover={toggleCover}
          onReset={resetTimer}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onToggleCountdown={() => setCountdownEnabled((prev) => !prev)}
          onOpenSessions={() => setShowSessionsModal(true)}
          onOpenScoreboard={() => setShowScoreboardModal(true)}
        />

        <ShortcutGuide tokens={activeTokens} />

        {/* Footer Regulatory Links (GDPR, CCPA, COPPA, FERPA) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-1 pb-2 text-[11px] sm:text-xs opacity-60 hover:opacity-100 transition-opacity select-none">
          <span>&copy; {new Date().getFullYear()} Clear Timer</span>
          <span aria-hidden="true">&bull;</span>
          <button
            type="button"
            onClick={() => {
              setTermsInitialTab('terms');
              setShowTermsModal(true);
            }}
            className="hover:underline cursor-pointer focus:outline-none focus:underline"
          >
            Terms &amp; Conditions
          </button>
          <span aria-hidden="true">&bull;</span>
          <button
            type="button"
            onClick={() => {
              setTermsInitialTab('privacy');
              setShowTermsModal(true);
            }}
            className="hover:underline cursor-pointer focus:outline-none focus:underline"
          >
            Privacy &amp; Data Rights (GDPR &bull; CCPA &bull; COPPA &bull; FERPA)
          </button>
          <span aria-hidden="true">&bull;</span>
          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer opacity-80 hover:opacity-100 inline-flex items-center gap-0.5"
            title="Open comprehensive standalone legal document in a new tab"
          >
            Legal Document &nearr;
          </a>
        </div>
      </footer>
    </main>
  );
}
