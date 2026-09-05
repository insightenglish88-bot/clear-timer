import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Eye, Lock, Zap, Flame, Smile, Briefcase, BookOpen, Target } from 'lucide-react';
import { formatTimeParts } from '../utils/formatTime';
import { TimerStatus, AppTheme, LearnerMode } from '../types';

interface TimerDisplayProps {
  elapsedMs: number;
  status: TimerStatus;
  isCovered: boolean;
  theme: AppTheme;
  mode?: LearnerMode;
  /** Block length the clock counts toward, in minutes. `null` = stopwatch. */
  targetMinutes?: number | null;
  onToggleCover: () => void;
  onToggleStartStop: () => void;
}

export function TimerDisplay({
  elapsedMs,
  status,
  isCovered,
  theme,
  mode = 'yle',
  targetMinutes = null,
  onToggleCover,
  onToggleStartStop,
}: TimerDisplayProps) {
  const { hours, minutes, seconds, hundredths, hasHours } =
    formatTimeParts(elapsedMs);
  const prefersReducedMotion = useReducedMotion();

  // Dynamic styling per learner profile
  const isBusiness = mode === 'business';
  const isMiddle = mode === 'middle';

  const containerBorder = isBusiness
    ? 'border-slate-700/80 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.10)]'
    : isMiddle
    ? 'border-indigo-600 shadow-[6px_6px_0px_rgba(67,56,202,0.4)]'
    : 'border-[#b91c1c] shadow-[8px_8px_0px_#000000]';

  const accentColor = isBusiness
    ? 'text-slate-700 dark:text-slate-300'
    : isMiddle
    ? 'text-indigo-600 dark:text-indigo-400'
    : 'text-[#b91c1c]';

  // `font-numeric` / `font-ui` are generated from the --font-* theme tokens in
  // index.css. (An arbitrary `font-[var(--font-numeric)]` is ambiguous between
  // font-family and font-weight and silently resolves to neither.)
  const fontClass = isBusiness
    ? 'font-numeric tracking-tight'
    : isMiddle
    ? 'font-ui tracking-tight'
    : 'font-cartoon';

  const chipBorder = isBusiness
    ? 'border-slate-400 dark:border-slate-600'
    : isMiddle
    ? 'border-indigo-600'
    : 'border-[#b91c1c]';

  // Progress toward the selected block.
  const targetMs = targetMinutes !== null ? targetMinutes * 60000 : 0;
  const hasTarget = targetMs > 0;
  const progressRatio = hasTarget ? elapsedMs / targetMs : 0;
  const isOvertime = hasTarget && progressRatio > 1;
  const remainingMs = Math.max(0, targetMs - elapsedMs);
  const remaining = formatTimeParts(remainingMs);

  /**
   * Numerals are sized against the container rather than the viewport, so the
   * clock fills whatever box it is given instead of overflowing a short one or
   * colliding with the chrome above it on small screens.
   */
  const bigGlyph = hasHours
    ? 'text-[clamp(2rem,min(14cqi,52cqh),11rem)]'
    : 'text-[clamp(2.5rem,min(23cqi,58cqh),15rem)]';
  const sepGlyph = hasHours
    ? 'text-[clamp(1.5rem,min(9cqi,36cqh),7rem)]'
    : 'text-[clamp(1.8rem,min(15cqi,40cqh),10rem)]';
  const smallGlyph = hasHours
    ? 'text-[clamp(1.3rem,min(9cqi,34cqh),7rem)]'
    : 'text-[clamp(1.6rem,min(14cqi,38cqh),9rem)]';

  const statusText =
    status === 'running'
      ? 'RUNNING'
      : status === 'countdown'
      ? 'STARTING...'
      : status === 'paused'
      ? 'PAUSED'
      : 'READY';

  return (
    <div
      id="timer-display-container"
      /* `container-type: size` (not Tailwind's inline-size-only `@container`)
         so the numerals below can size against the box height with `cqh`. */
      className={`[container-type:size] relative w-full flex-1 min-h-0 flex flex-col rounded-3xl sm:rounded-[2.5rem] border-4 sm:border-[5px] p-2.5 sm:p-4 overflow-hidden select-none transition-colors duration-200 ${containerBorder} ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Background Subtle Red/Indigo/Slate Grid */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none opacity-10 ${
          isBusiness
            ? 'bg-[radial-gradient(#475569_2px,transparent_2px)]'
            : isMiddle
            ? 'bg-[radial-gradient(#6366f1_2px,transparent_2px)]'
            : 'bg-[radial-gradient(#b91c1c_2px,transparent_2px)]'
        } [background-size:24px_24px]`}
      />

      {/*
        Status row sits in normal flow rather than absolutely positioned. When
        it was absolute the numerals ran straight through it on small screens.
      */}
      <div className="relative z-10 shrink-0 flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-2 bg-white dark:bg-neutral-900 border-2 px-3 py-1 rounded-full shadow-sm ${chipBorder}`}
        >
          {status === 'running' ? (
            <Zap className={`w-4 h-4 fill-current ${accentColor} motion-safe:animate-bounce`} />
          ) : status === 'countdown' ? (
            <Flame className={`w-4 h-4 fill-current ${accentColor} motion-safe:animate-pulse`} />
          ) : isBusiness ? (
            <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          ) : isMiddle ? (
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Smile className="w-4 h-4 text-black dark:text-white" />
          )}
          <span className="font-comic text-xs sm:text-sm font-bold tracking-wide uppercase text-black dark:text-white">
            {statusText}
          </span>
        </div>

        {/* The block readout replaces what used to be a second "Clear Timer"
            wordmark duplicating the header two rows above it. */}
        {hasTarget && (
          <div
            className={`flex items-center gap-1.5 bg-white dark:bg-neutral-900 border-2 px-3 py-1 rounded-full shadow-sm ${
              isOvertime ? 'border-rose-600' : chipBorder
            }`}
          >
            <Target
              className={`w-3.5 h-3.5 ${
                isOvertime ? 'text-rose-600 dark:text-rose-400' : accentColor
              }`}
            />
            <span className="font-comic text-xs sm:text-sm font-bold tabular-nums text-black dark:text-white">
              {isOvertime ? (
                <span className="text-rose-700 dark:text-rose-400">
                  Over by {formatTimeParts(elapsedMs - targetMs).minutes}:
                  {formatTimeParts(elapsedMs - targetMs).seconds}
                </span>
              ) : (
                <>
                  {remaining.minutes}:{remaining.seconds} left of {targetMinutes}m
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Main Screen-Filling Numerals */}
      <button
        id="digital-clock-face"
        type="button"
        onClick={onToggleStartStop}
        aria-label={
          status === 'running'
            ? 'Pause the timer'
            : status === 'paused'
            ? 'Resume the timer'
            : 'Start the timer'
        }
        className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center tracking-tighter tabular-nums leading-none select-none font-black px-1 cursor-pointer transition-transform active:scale-[0.99]"
      >
        <span aria-hidden="true" className="flex items-baseline justify-center flex-nowrap w-full">
          {hasHours && (
            <>
              <span className={`${fontClass} ${bigGlyph} font-black ${accentColor} drop-shadow-sm`}>
                {hours}
              </span>
              <span className={`font-comic ${sepGlyph} font-black ${accentColor} mx-[0.03em]`}>
                :
              </span>
            </>
          )}
          <span
            className={`${fontClass} ${bigGlyph} font-black ${
              theme === 'dark' ? 'text-white' : 'text-black'
            } drop-shadow-sm`}
          >
            {minutes}
          </span>
          <span className={`font-comic ${sepGlyph} font-black ${accentColor} mx-[0.03em]`}>
            :
          </span>
          <span
            className={`${fontClass} ${bigGlyph} font-black ${
              theme === 'dark' ? 'text-white' : 'text-black'
            } drop-shadow-sm`}
          >
            {seconds}
          </span>
          <span
            className={`font-comic ${smallGlyph} font-black ${accentColor} ml-[0.03em] mr-[0.01em]`}
          >
            .
          </span>
          <span className={`${fontClass} ${smallGlyph} font-black ${accentColor}`}>
            {hundredths}
          </span>
        </span>
      </button>

      {/* Progress toward the selected block. */}
      {hasTarget && (
        <div className="relative z-10 shrink-0 px-1 pb-0.5">
          <div
            className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(100, Math.round(progressRatio * 100))}
            aria-label={`Progress through the ${targetMinutes} minute block`}
          >
            <div
              /* No width transition: this value is already updated every
                 animation frame, so a 200ms ease only makes the bar lag the
                 clock it is describing. Colour still eases between states. */
              className={`h-full transition-colors duration-200 ${
                isOvertime
                  ? 'bg-rose-600'
                  : progressRatio >= 0.8
                  ? 'bg-amber-500'
                  : isBusiness
                  ? 'bg-slate-700 dark:bg-slate-300'
                  : isMiddle
                  ? 'bg-indigo-600'
                  : 'bg-[#b91c1c]'
              }`}
              style={{ width: `${Math.min(100, progressRatio * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 100% Opaque Privacy Shield */}
      <AnimatePresence>
        {isCovered && (
          <motion.div
            id="privacy-vault-shield"
            role="group"
            aria-label="Timer display covered"
            /* The shield must be opaque the instant it mounts. Fading it in
               from opacity 0 would make the "covered" state depend on an
               animation completing, and anywhere frames are starved the
               timer would stay readable through a cover that claims to
               hide it. Motion here scales only: an enhancement, never the
               thing that makes the cover a cover. */
            initial={prefersReducedMotion ? false : { scale: 0.97 }}
            animate={prefersReducedMotion ? {} : { scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-black select-none overflow-y-auto"
          >
            <div className="relative mb-4 sm:mb-6 shrink-0">
              <div
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-4 border-white flex flex-col items-center justify-center shadow-[6px_6px_0px_#ffffff] rotate-[-3deg] ${
                  isBusiness
                    ? 'bg-slate-800'
                    : isMiddle
                    ? 'bg-indigo-600'
                    : 'bg-[#b91c1c]'
                }`}
              >
                <Lock className="w-10 h-10 sm:w-14 sm:h-14 text-white stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-black text-xs sm:text-sm font-comic font-black px-2.5 py-0.5 rounded-full border-2 border-black rotate-[8deg] shadow-[2px_2px_0px_#000]">
                COVERED
              </div>
            </div>

            <div className="space-y-2 max-w-md bg-white text-black p-4 sm:p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000] shrink-0">
              <h2 className="font-comic text-xl sm:text-3xl font-black tracking-tight">
                Timer is Covered!
              </h2>
              <p className="font-comic text-xs sm:text-sm font-bold text-neutral-800 leading-snug">
                The clock is still running. Press{' '}
                <kbd className="bg-neutral-100 text-black px-1.5 py-0.5 rounded border border-black font-mono font-bold text-xs">
                  Space
                </kbd>{' '}
                to start or stop it, or reveal it below.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onToggleStartStop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b91c1c] text-white border-4 border-black font-comic font-black text-sm sm:text-base shadow-[4px_4px_0px_#000] hover:bg-[#991b1b] transition-colors cursor-pointer"
              >
                {status === 'running' ? 'Stop Timer (Space)' : 'Start Timer (Space)'}
              </button>

              <button
                type="button"
                onClick={onToggleCover}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black border-4 border-black font-comic font-black text-sm sm:text-base shadow-[4px_4px_0px_#000] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Eye className="w-5 h-5" />
                <span>Reveal Timer (C)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
