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
  Trophy,
} from 'lucide-react';
import { TimerStatus } from '../types';
import { SkinTokens } from '../theme/skins';

interface TimerControlsProps {
  status: TimerStatus;
  isCovered: boolean;
  soundEnabled: boolean;
  countdownEnabled: boolean;
  tokens: SkinTokens;
  onToggleStartStop: () => void;
  onToggleCover: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onToggleCountdown: () => void;
  onOpenSessions: () => void;
  onOpenScoreboard: () => void;
}

export function TimerControls({
  status,
  isCovered,
  soundEnabled,
  countdownEnabled,
  tokens,
  onToggleStartStop,
  onToggleCover,
  onReset,
  onToggleSound,
  onToggleCountdown,
  onOpenSessions,
  onOpenScoreboard,
}: TimerControlsProps) {
  const isRunning = status === 'running';
  const isCountdown = status === 'countdown';
  const isIdle = status === 'idle';

  const isBracket = !!tokens.buttons.bracketStyle;
  const pillRounded = tokens.buttons.pillRounded;

  return (
    <div id="timer-controls-bar" className="w-full flex flex-col gap-2.5">
      {/* Primary Action Buttons: Start/Stop and Cover Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {/* Start / Stop Button */}
        <button
          id="btn-start-stop"
          type="button"
          onClick={onToggleStartStop}
          className={`relative flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 ${pillRounded} ${tokens.typography.fontBody} font-bold text-base sm:text-lg transition-all cursor-pointer ${
            isRunning
              ? tokens.buttons.primaryStop
              : isCountdown
              ? tokens.buttons.primaryCountdown
              : tokens.buttons.primaryStart
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>{isBracket ? '[ STOP / PAUSE ]' : 'Stop / Pause'}</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/20 dark:bg-white/20 font-mono font-bold ml-1">
                Space
              </kbd>
            </>
          ) : isCountdown ? (
            <>
              <span>{isBracket ? '[ CANCEL COUNTDOWN ]' : 'Cancel Countdown'}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>
                {isBracket
                  ? isIdle
                    ? '[ START TIMER ]'
                    : '[ RESUME TIMER ]'
                  : isIdle
                  ? 'Start Timer'
                  : 'Resume Timer'}
              </span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/20 dark:bg-white/20 font-mono font-bold ml-1">
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
          className={`flex items-center justify-center gap-2 py-3.5 sm:py-4 px-5 ${pillRounded} ${tokens.typography.fontBody} font-bold text-base sm:text-lg transition-all cursor-pointer ${
            isCovered
              ? tokens.buttons.coverActive
              : tokens.buttons.coverInactive
          }`}
          title={isCovered ? 'Uncover the timer' : 'Cover the timer'}
        >
          {isCovered ? (
            <>
              <Eye className="w-5 h-5 stroke-[2.5]" />
              <span>{isBracket ? '[ UNCOVER TIMER ]' : 'Uncover Timer'}</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/20 dark:bg-white/20 font-mono font-bold ml-1">
                C
              </kbd>
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5 stroke-[2.5]" />
              <span>{isBracket ? '[ COVER TIMER ]' : 'Cover Timer'}</span>
              <kbd className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono font-bold ml-1">
                C
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Secondary Bar: Reset, Sound, 5s Countdown, Scoreboard, Saved Sessions */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-1 text-xs font-bold">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Reset */}
          <button
            id="btn-reset-timer"
            type="button"
            onClick={onReset}
            disabled={isIdle && !isCountdown}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} transition-all cursor-pointer ${tokens.buttons.secondary} disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBracket ? '[ RESET (R) ]' : 'Reset (R)'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} transition-all cursor-pointer ${tokens.buttons.secondary}`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isBracket ? '[ SOUND: ON ]' : 'Sound On'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span>{isBracket ? '[ SOUND: OFF ]' : 'Sound Off'}</span>
              </>
            )}
          </button>

          {/* 5s Countdown Toggle */}
          <button
            id="btn-toggle-countdown"
            type="button"
            onClick={onToggleCountdown}
            aria-pressed={countdownEnabled}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} transition-all cursor-pointer ${
              countdownEnabled
                ? tokens.buttons.primaryStart
                : tokens.buttons.secondary
            }`}
            title="Toggle the 5-second countdown before start"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>
              {isBracket
                ? `[ COUNTDOWN: ${countdownEnabled ? 'ON' : 'OFF'} ]`
                : `5s Countdown: ${countdownEnabled ? 'ON' : 'OFF'}`}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Scoreboard Trigger */}
          <button
            id="btn-open-scoreboard"
            type="button"
            onClick={onOpenScoreboard}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 ${pillRounded} transition-all cursor-pointer ${tokens.buttons.secondary}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{isBracket ? '[ SCOREBOARD ]' : 'Scoreboard'}</span>
          </button>

          {/* Sessions Modal Trigger */}
          <button
            id="btn-open-sessions"
            type="button"
            onClick={onOpenSessions}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 ${pillRounded} transition-all cursor-pointer ${tokens.buttons.secondary}`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isBracket ? '[ SAVED SESSIONS ]' : 'Saved Sessions'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
