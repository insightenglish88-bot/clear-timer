/**
 * Clear Timer - Adaptive Multi-Tier Classroom, Study & Executive Timer
 * Supports:
 * - Mode A: YLE Learners (Kids, games, visual cues, sound fanfare)
 * - Mode B: Middle School (Study blocks, focus intervals, task tracking)
 * - Mode C: Business English (Executive pacing, agenda timer, speech rehearsal)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Trophy, BookOpen, Presentation, Sparkles } from 'lucide-react';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { ShortcutGuide } from './components/ShortcutGuide';
import { CountdownOverlay } from './components/CountdownOverlay';
import { SessionsModal } from './components/SessionsModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import { ModeSelector } from './components/ModeSelector';
import { MiddleSchoolPanel } from './components/MiddleSchoolPanel';
import { BusinessEnglishPanel } from './components/BusinessEnglishPanel';
import { TimerStatus, AppTheme, Team, LearnerMode } from './types';
import { playSound } from './utils/audio';

export default function App() {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [isCovered, setIsCovered] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [countdownEnabled, setCountdownEnabled] = useState<boolean>(true);
  const [showSessionsModal, setShowSessionsModal] = useState<boolean>(false);
  const [showScoreboardModal, setShowScoreboardModal] = useState<boolean>(false);
  const [showAuxPanel, setShowAuxPanel] = useState<boolean>(true);

  // Centralized Learner Profile Mode
  const [mode, setMode] = useState<LearnerMode>(() => {
    try {
      const savedMode = localStorage.getItem('clear_timer_mode');
      if (savedMode === 'yle' || savedMode === 'middle' || savedMode === 'business') {
        return savedMode;
      }
    } catch {}
    return 'yle';
  });

  // Save mode whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_mode', mode);
      // Update document title for SEO & context
      const modeTitles = {
        yle: 'Clear Timer — YLE Learners & Classroom Game Timer',
        middle: 'Clear Timer — Middle School Study & Focus Interval Blocks',
        business: 'Clear Timer — Business English & Executive Speech Pacing',
      };
      document.title = modeTitles[mode] || 'Clear Timer';
    } catch {}
  }, [mode]);

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
      prev.map((t) => (t.id === id ? { ...t, timeMs: Math.max(0, timeMs) } : t))
    );
  }, []);

  const handleAdjustTeamTime = useCallback((id: string, deltaMs: number) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timeMs: Math.max(0, t.timeMs + deltaMs) } : t
      )
    );
  }, []);

  const handleResetAllTimes = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, timeMs: 0 })));
  }, []);

  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem('clear_timer_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    return 'light';
  });

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

  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_theme', theme);
    } catch {}
  }, [theme]);

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

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Preset setter for Middle School / Business
  const handleSetPresetDuration = useCallback((minutes: number) => {
    resetTimer();
    setElapsedMs(0);
  }, [resetTimer]);

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

  // Mode-specific branding
  const brandColor =
    mode === 'business'
      ? 'text-slate-800 dark:text-slate-200'
      : mode === 'middle'
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-[#b91c1c]';

  const brandRuleBg =
    mode === 'business'
      ? 'bg-slate-700'
      : mode === 'middle'
      ? 'bg-indigo-600'
      : 'bg-[#b91c1c]';

  return (
    <main
      id="timer-app-root"
      className={`min-h-screen w-screen flex flex-col justify-between p-3 sm:p-4 select-none transition-colors duration-200 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* 5-Second Countdown Overlay */}
      <AnimatePresence>
        {status === 'countdown' && (
          <CountdownOverlay
            soundEnabled={soundEnabled}
            theme={theme}
            onComplete={handleCountdownComplete}
            onCancel={handleCountdownCancel}
          />
        )}
      </AnimatePresence>

      {/* Team Time Scoreboard Modal (YLE Mode) */}
      <AnimatePresence>
        {showScoreboardModal && (
          <ScoreboardModal
            teams={teams}
            currentElapsedMs={elapsedMs}
            theme={theme}
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
      <AnimatePresence>
        {showSessionsModal && (
          <SessionsModal
            currentElapsedMs={elapsedMs}
            theme={theme}
            mode={mode}
            onClose={() => setShowSessionsModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Top Header: Brand Identity & Adaptive Mode Selector */}
      <header className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 pb-2 shrink-0">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex flex-col">
            <div className={`w-full h-1.5 ${brandRuleBg} rounded-full mb-0.5 transition-colors`} />
            <div className="flex items-baseline gap-1.5 px-1">
              <span className={`font-black text-2xl sm:text-3xl tracking-tight drop-shadow-sm transition-colors ${brandColor}`}>
                clear
              </span>
              <span className="font-bold text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                timer
              </span>
            </div>
            <div className={`w-full h-1.5 ${brandRuleBg} rounded-full mt-0.5 transition-colors`} />
          </div>

          {/* Mobile Cover active badge */}
          {isCovered && (
            <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b91c1c] text-white text-xs font-bold shadow-sm animate-pulse">
              <span>🙈 COVERED</span>
            </div>
          )}
        </div>

        {/* Centralized Mode Selector */}
        <div className="flex items-center justify-center">
          <ModeSelector
            currentMode={mode}
            theme={theme}
            onSelectMode={(newMode) => setMode(newMode)}
          />
        </div>

        {/* Right Status Badges & Quick Action */}
        <div className="hidden md:flex items-center gap-2">
          {isCovered && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b91c1c] text-white border-2 border-black text-xs font-bold shadow-sm animate-pulse">
              <span>🙈 COVER ACTIVE</span>
            </div>
          )}

          {mode === 'yle' && (
            <button
              type="button"
              onClick={() => setShowScoreboardModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-black bg-white dark:bg-neutral-900 text-black dark:text-white text-xs font-bold shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              title="Open Team Time Scoreboard"
            >
              <Trophy className="w-3.5 h-3.5 text-[#b91c1c]" />
              <span>Team Times ({teams.length})</span>
            </button>
          )}

          {mode === 'middle' && (
            <button
              type="button"
              onClick={() => setShowAuxPanel((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-indigo-600 bg-white dark:bg-neutral-900 text-black dark:text-white text-xs font-bold shadow-sm hover:bg-indigo-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              title="Toggle Study Tasks Panel"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{showAuxPanel ? 'Hide Tasks' : 'Show Tasks'}</span>
            </button>
          )}

          {mode === 'business' && (
            <button
              type="button"
              onClick={() => setShowAuxPanel((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-slate-700 bg-white dark:bg-neutral-900 text-black dark:text-white text-xs font-bold shadow-sm hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              title="Toggle Pacing Panel"
            >
              <Presentation className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span>{showAuxPanel ? 'Hide Agenda' : 'Show Agenda'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Core Section: Screen-Filling Numerals */}
      <section aria-label="Digital Timer Display" className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center my-1 min-h-0">
        <TimerDisplay
          elapsedMs={elapsedMs}
          status={status}
          isCovered={isCovered}
          theme={theme}
          mode={mode}
          onToggleCover={toggleCover}
          onToggleStartStop={toggleStartStop}
        />
      </section>

      {/* Adaptive Mode-Specific Panel (Middle School & Business English) */}
      {showAuxPanel && mode === 'middle' && (
        <section aria-label="Study Blocks and Tasks" className="w-full max-w-4xl mx-auto my-2">
          <MiddleSchoolPanel
            theme={theme}
            elapsedMs={elapsedMs}
            onSetPresetDuration={handleSetPresetDuration}
          />
        </section>
      )}

      {showAuxPanel && mode === 'business' && (
        <section aria-label="Executive Presentation Pacing" className="w-full max-w-4xl mx-auto my-2">
          <BusinessEnglishPanel
            theme={theme}
            elapsedMs={elapsedMs}
          />
        </section>
      )}

      {/* Bottom Bar: Action Controls & Hotkeys */}
      <footer className="w-full max-w-4xl mx-auto shrink-0 flex flex-col gap-2 pt-1">
        <TimerControls
          status={status}
          isCovered={isCovered}
          soundEnabled={soundEnabled}
          countdownEnabled={countdownEnabled}
          theme={theme}
          onToggleStartStop={toggleStartStop}
          onToggleCover={toggleCover}
          onReset={resetTimer}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onToggleCountdown={() => setCountdownEnabled((prev) => !prev)}
          onToggleTheme={toggleTheme}
          onOpenSessions={() => setShowSessionsModal(true)}
          onOpenScoreboard={() => setShowScoreboardModal(true)}
        />

        <ShortcutGuide theme={theme} />
      </footer>
    </main>
  );
}
