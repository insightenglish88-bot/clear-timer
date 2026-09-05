/**
 * Clear Timer - Precision Aesthetic Stopwatch & Countdown Timer
 * Features:
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
import { SkinSelector } from './components/SkinSelector';
import { SKINS, DEFAULT_SKIN_ID, SkinId } from './theme/skins';
import { TimerStatus, Team } from './types';
import { playSound } from './utils/audio';

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

  // Teams & Scoreboard state persisted in localStorage
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_teams');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'team-1', name: 'Team Alpha', timeMs: 0 },
      { id: 'team-2', name: 'Team Beta', timeMs: 0 },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_teams', JSON.stringify(teams));
    } catch {}
  }, [teams]);

  // Team action handlers
  const handleAddTeam = useCallback((name: string) => {
    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      timeMs: 0,
    };
    setTeams((prev) => [...prev, newTeam]);
  }, []);

  const handleRemoveTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSetTeamTime = useCallback((id: string, timeMs: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, timeMs: Math.max(0, timeMs) } : t)),
    );
  }, []);

  const handleAdjustTeamTime = useCallback((id: string, deltaMs: number) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timeMs: Math.max(0, t.timeMs + deltaMs) } : t,
      ),
    );
  }, []);

  const handleResetAllTimes = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, timeMs: 0 })));
  }, []);

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

      {/* Team Time Scoreboard Modal */}
      <AnimatePresence>
        {showScoreboardModal && (
          <ScoreboardModal
            teams={teams}
            currentElapsedMs={elapsedMs}
            tokens={activeTokens}
            onAddTeam={handleAddTeam}
            onRemoveTeam={handleRemoveTeam}
            onSetTeamTime={handleSetTeamTime}
            onAdjustTeamTime={handleAdjustTeamTime}
            onResetAllTimes={handleResetAllTimes}
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

        {/* Right Header Controls: Cover Indicator & Team Time Quick Trigger */}
        <div className="hidden md:flex items-center gap-2">
          {isCovered && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 ${activeTokens.buttons.pillRounded} text-xs font-bold shadow-sm ${activeTokens.accent.badgeBg} ${activeTokens.accent.badgeText} border ${activeTokens.accent.badgeBorder}`}
            >
              <span>Cover active</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowScoreboardModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 ${activeTokens.buttons.pillRounded} text-xs font-bold transition-all cursor-pointer ${activeTokens.buttons.secondary}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Teams ({teams.length})</span>
          </button>
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
      </footer>
    </main>
  );
}
