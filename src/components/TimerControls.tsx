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
import { TimerStatus, AppTheme } from '../types';

interface TimerControlsProps {
  status: TimerStatus;
  isCovered: boolean;
  soundEnabled: boolean;
  countdownEnabled: boolean;
  theme: AppTheme;
  onToggleStartStop: () => void;
  onToggleCover: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onToggleCountdown: () => void;
  onToggleTheme: () => void;
  onOpenSessions: () => void;
  onOpenScoreboard: () => void;
}

export function TimerControls({
  status,
  isCovered,
  soundEnabled,
  countdownEnabled,
  theme,
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

  return (
    <div id="timer-controls-bar" className="w-full flex flex-col gap-2.5">
      {/* Primary Action Buttons: Start/Stop and Cover Timer (Red, White, Black) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Start / Stop Button */}
        <button
          id="btn-start-stop"
          type="button"
          onClick={onToggleStartStop}
          className={`relative flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl font-comic font-bold text-base sm:text-xl border-3 border-black transition-all cursor-pointer comic-shadow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            isRunning
              ? 'bg-black hover:bg-neutral-900 text-white'
              : isCountdown
              ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-white animate-pulse'
              : 'bg-[#b91c1c] hover:bg-[#991b1b] text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current text-white" />
              <span>Stop / Pause</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-white/20 text-white font-bold ml-1">
                Space
              </kbd>
            </>
          ) : isCountdown ? (
            <>
              <span>Cancel Countdown</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current text-white" />
              <span>{isIdle ? 'Start Timer' : 'Resume Timer'}</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/20 text-white font-bold ml-1">
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
          className={`flex items-center justify-center gap-2 py-3.5 sm:py-4 px-5 rounded-2xl font-comic font-bold text-base sm:text-lg border-3 border-black transition-all cursor-pointer comic-shadow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            isCovered
              ? 'bg-[#b91c1c] text-white hover:bg-[#991b1b]'
              : 'bg-white text-black hover:bg-neutral-100'
          }`}
          title={isCovered ? 'Uncover the timer' : 'Cover the timer'}
        >
          {isCovered ? (
            <>
              <Eye className="w-5 h-5 text-white stroke-[2.5]" />
              <span>Uncover Timer</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/20 text-white font-bold ml-1">
                C
              </kbd>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5 text-black stroke-[2.5]" />
              <span>Cover Timer</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-neutral-200 text-black font-bold ml-1">
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
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white border-2 border-black comic-shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#b91c1c]" />
            Reset (R)
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white border-2 border-black comic-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#b91c1c]" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span>Sound Off</span>
              </>
            )}
          </button>

          {/* 5s Countdown Toggle */}
          <button
            id="btn-toggle-countdown"
            type="button"
            onClick={onToggleCountdown}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-black comic-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              countdownEnabled
                ? 'bg-[#b91c1c] text-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-500'
            }`}
            title="Toggle 5-second countdown before start"
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
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-black text-black dark:text-white border-2 border-black comic-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <Trophy className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Scoreboard</span>
          </button>

          {/* Sessions Modal Trigger */}
          <button
            id="btn-open-sessions"
            type="button"
            onClick={onOpenSessions}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white border-2 border-black comic-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Saved Sessions</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            id="btn-toggle-theme"
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white border-2 border-black comic-shadow-sm transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-black" />
            ) : (
              <Sun className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
