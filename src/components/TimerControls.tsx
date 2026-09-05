import {
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  Save,
  Sun,
  Moon,
  Trophy,
} from 'lucide-react';
import { TimerStatus, AppTheme, LearnerMode } from '../types';

interface TimerControlsProps {
  status: TimerStatus;
  isCovered: boolean;
  soundEnabled: boolean;
  countdownEnabled: boolean;
  theme: AppTheme;
  mode?: LearnerMode;
  onToggleStartStop: () => void;
  onToggleCover: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onToggleCountdown: () => void;
  onToggleTheme: () => void;
  onOpenSessions: () => void;
  onOpenScoreboard: () => void;
}

/**
 * The control bar is shared chrome, so its accent has to follow the active
 * learner profile. Previously every mode rendered YLE red, which put a
 * cartoon-red primary button under the executive presentation panel.
 */
const ACCENT: Record<
  LearnerMode,
  { solid: string; onSolid: string; ink: string; border: string }
> = {
  yle: {
    solid: 'bg-[#b91c1c] hover:bg-[#991b1b]',
    onSolid: 'text-white',
    ink: 'text-[#b91c1c]',
    border: 'border-black',
  },
  middle: {
    solid: 'bg-indigo-600 hover:bg-indigo-700',
    onSolid: 'text-white',
    ink: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-900 dark:border-indigo-300',
  },
  business: {
    solid: 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-white',
    onSolid: 'text-white dark:text-slate-900',
    ink: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-700 dark:border-slate-400',
  },
};

export function TimerControls({
  status,
  isCovered,
  soundEnabled,
  countdownEnabled,
  theme,
  mode = 'yle',
  onToggleStartStop,
  onToggleCover,
  onReset,
  onToggleSound,
  onToggleCountdown,
  onToggleTheme,
  onOpenSessions,
  onOpenScoreboard,
}: TimerControlsProps) {
  const isRunning = status === 'running';
  const isCountdown = status === 'countdown';
  const isIdle = status === 'idle';
  const accent = ACCENT[mode];

  // One shape and one surface for every secondary control.
  const secondary = `inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white border-2 ${accent.border} comic-shadow-sm transition-colors cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-800`;

  return (
    <div id="timer-controls-bar" className="w-full flex flex-col gap-2.5">
      {/* Primary Action Buttons: Start/Stop and Cover Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Start / Stop Button */}
        <button
          id="btn-start-stop"
          type="button"
          onClick={onToggleStartStop}
          className={`relative flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl font-comic font-bold text-base sm:text-xl border-3 ${
            accent.border
          } transition-colors cursor-pointer comic-shadow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            isRunning
              ? 'bg-black hover:bg-neutral-900 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-black'
              : isCountdown
              ? `${accent.solid} ${accent.onSolid} motion-safe:animate-pulse`
              : `${accent.solid} ${accent.onSolid}`
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Stop / Pause</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-white/20 dark:bg-black/15 font-bold ml-1">
                Space
              </kbd>
            </>
          ) : isCountdown ? (
            <>
              <span>Cancel Countdown</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{isIdle ? 'Start Timer' : 'Resume Timer'}</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/25 font-bold ml-1">
                Space
              </kbd>
            </>
          )}
        </button>

        {/* Cover The Timer Button */}
        <button
          id="btn-cover-timer"
          type="button"
          onClick={onToggleCover}
          aria-pressed={isCovered}
          className={`flex items-center justify-center gap-2 py-3.5 sm:py-4 px-5 rounded-2xl font-comic font-bold text-base sm:text-lg border-3 ${
            accent.border
          } transition-colors cursor-pointer comic-shadow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            isCovered
              ? `${accent.solid} ${accent.onSolid}`
              : 'bg-white text-black hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800'
          }`}
          title={isCovered ? 'Uncover the timer' : 'Cover the timer'}
        >
          {isCovered ? (
            <>
              <Eye className="w-5 h-5 stroke-[2.5]" />
              <span>Uncover Timer</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/25 font-bold ml-1">
                C
              </kbd>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5 stroke-[2.5]" />
              <span>Cover Timer</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-700 font-bold ml-1">
                C
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Secondary Bar: Reset, Sound, 5s Countdown, Scoreboard, Saved Sessions, Theme */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-1 text-xs font-comic font-bold">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Reset */}
          <button
            id="btn-reset-timer"
            type="button"
            onClick={onReset}
            disabled={isIdle && !isCountdown}
            className={`${secondary} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${accent.ink}`} />
            Reset (R)
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className={secondary}
          >
            {soundEnabled ? (
              <>
                <Volume2 className={`w-3.5 h-3.5 ${accent.ink}`} />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Sound Off</span>
              </>
            )}
          </button>

          {/* 5s Countdown Toggle */}
          <button
            id="btn-toggle-countdown"
            type="button"
            onClick={onToggleCountdown}
            aria-pressed={countdownEnabled}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 ${
              accent.border
            } comic-shadow-sm transition-colors cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              countdownEnabled
                ? `${accent.solid} ${accent.onSolid}`
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
            }`}
            title="Toggle the 5-second countdown before start"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>5s Countdown: {countdownEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Scoreboard Trigger */}
          <button
            id="btn-open-scoreboard"
            type="button"
            onClick={onOpenScoreboard}
            className={`${secondary} px-3`}
          >
            <Trophy className={`w-3.5 h-3.5 ${accent.ink}`} />
            <span>Scoreboard</span>
          </button>

          {/* Sessions Modal Trigger */}
          <button
            id="btn-open-sessions"
            type="button"
            onClick={onOpenSessions}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 ${accent.border} ${accent.solid} ${accent.onSolid} comic-shadow-sm transition-colors cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Saved Sessions</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            id="btn-toggle-theme"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className={`p-1.5 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white border-2 ${accent.border} comic-shadow-sm transition-colors cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-800`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
