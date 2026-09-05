import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Eye, Lock, Zap, Flame, Clock, Target } from 'lucide-react';
import { formatTimeParts } from '../utils/formatTime';
import { TimerStatus } from '../types';
import { SkinTokens } from '../theme/skins';

interface TimerDisplayProps {
  elapsedMs: number;
  status: TimerStatus;
  isCovered: boolean;
  tokens: SkinTokens;
  /** Block length the clock counts toward, in minutes. `null` = stopwatch. */
  targetMinutes?: number | null;
  onToggleCover: () => void;
  onToggleStartStop: () => void;
}

export function TimerDisplay({
  elapsedMs,
  status,
  isCovered,
  tokens,
  targetMinutes = null,
  onToggleCover,
  onToggleStartStop,
}: TimerDisplayProps) {
  const { hours, minutes, seconds, hundredths, hasHours } =
    formatTimeParts(elapsedMs);
  const prefersReducedMotion = useReducedMotion();

  // Progress toward the selected block
  const targetMs = targetMinutes !== null ? targetMinutes * 60000 : 0;
  const hasTarget = targetMs > 0;
  const progressRatio = hasTarget ? elapsedMs / targetMs : 0;
  const isOvertime = hasTarget && progressRatio > 1;
  const remainingMs = Math.max(0, targetMs - elapsedMs);
  const remaining = formatTimeParts(remainingMs);

  /**
   * Numerals are sized against the container using container-query units (cqh / cqi).
   * Now that auxiliary panels are gone, we maximize the numeral scaling to fill the display.
   */
  const bigGlyph = hasHours
    ? 'text-[clamp(2.5rem,min(16cqi,58cqh),13rem)]'
    : 'text-[clamp(3.5rem,min(25cqi,65cqh),18rem)]';
  const sepGlyph = hasHours
    ? 'text-[clamp(1.8rem,min(10cqi,40cqh),8rem)]'
    : 'text-[clamp(2.2rem,min(17cqi,46cqh),12rem)]';
  const smallGlyph = hasHours
    ? 'text-[clamp(1.5rem,min(10cqi,36cqh),8rem)]'
    : 'text-[clamp(2rem,min(16cqi,42cqh),11rem)]';

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
      className={`[container-type:size] relative w-full flex-1 min-h-0 flex flex-col ${tokens.surface.rounded} border-2 sm:border-4 p-3 sm:p-6 overflow-hidden select-none transition-all duration-300 ${tokens.surface.border} ${tokens.surface.bg} ${tokens.surface.shadow} ${tokens.surface.backdrop || ''}`}
    >
      {/* Background Grid Pattern */}
      {tokens.surface.gridPattern && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none opacity-15 ${tokens.surface.gridPattern} [background-size:24px_24px]`}
        />
      )}

      {/* Retro CRT Scanlines Overlay */}
      {tokens.effects?.scanlines && (
        <div
          aria-hidden="true"
          className="absolute inset-0 crt-scanlines pointer-events-none z-20"
        />
      )}

      {/* Top Status & Target Indicator Row */}
      <div className="relative z-10 shrink-0 flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-2 border px-3.5 py-1.5 ${tokens.buttons.pillRounded} shadow-xs transition-colors ${tokens.accent.badgeBg} ${tokens.accent.badgeBorder} ${tokens.accent.badgeText}`}
        >
          {status === 'running' ? (
            <Zap
              className={`w-4 h-4 fill-current ${tokens.accent.color} motion-safe:animate-bounce ${tokens.accent.glow}`}
            />
          ) : status === 'countdown' ? (
            <Flame
              className={`w-4 h-4 fill-current ${tokens.accent.color} motion-safe:animate-pulse ${tokens.accent.glow}`}
            />
          ) : (
            <Clock className={`w-4 h-4 ${tokens.accent.color}`} />
          )}
          <span
            className={`${tokens.typography.fontBody} text-xs sm:text-sm font-bold tracking-wider uppercase`}
          >
            {tokens.buttons.bracketStyle ? `[ ${statusText} ]` : statusText}
          </span>
        </div>

        {/* Target Block Readout */}
        {hasTarget && (
          <div
            className={`flex items-center gap-1.5 border px-3.5 py-1.5 ${tokens.buttons.pillRounded} shadow-xs transition-colors ${tokens.accent.badgeBg} ${
              isOvertime ? 'border-rose-500 text-rose-400' : `${tokens.accent.badgeBorder} ${tokens.accent.badgeText}`
            }`}
          >
            <Target
              className={`w-3.5 h-3.5 ${
                isOvertime ? 'text-rose-500' : tokens.accent.color
              }`}
            />
            <span
              className={`${tokens.typography.fontNumeric} text-xs sm:text-sm font-bold tabular-nums`}
            >
              {isOvertime ? (
                <span className="text-rose-500">
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
        className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center tracking-tighter tabular-nums leading-none select-none font-black px-1 cursor-pointer transition-transform active:scale-[0.995]"
      >
        <span
          aria-hidden="true"
          className={`flex items-baseline justify-center flex-nowrap w-full ${tokens.numerals.glow}`}
        >
          {hasHours && (
            <>
              <span
                className={`${tokens.numerals.fontClass} ${bigGlyph} ${tokens.numerals.secondaryColor}`}
              >
                {hours}
              </span>
              <span
                className={`${tokens.numerals.fontClass} ${sepGlyph} ${tokens.numerals.separatorColor} mx-[0.03em]`}
              >
                :
              </span>
            </>
          )}
          <span
            className={`${tokens.numerals.fontClass} ${bigGlyph} ${tokens.numerals.color}`}
          >
            {minutes}
          </span>
          <span
            className={`${tokens.numerals.fontClass} ${sepGlyph} ${tokens.numerals.separatorColor} mx-[0.03em]`}
          >
            :
          </span>
          <span
            className={`${tokens.numerals.fontClass} ${bigGlyph} ${tokens.numerals.color}`}
          >
            {seconds}
          </span>
          <span
            className={`${tokens.numerals.fontClass} ${smallGlyph} ${tokens.numerals.separatorColor} ml-[0.03em] mr-[0.01em]`}
          >
            .
          </span>
          <span
            className={`${tokens.numerals.fontClass} ${smallGlyph} ${tokens.numerals.secondaryColor}`}
          >
            {hundredths}
          </span>
        </span>
      </button>

      {/* Progress Bar (when Target Block is active) */}
      {hasTarget && (
        <div className="relative z-10 shrink-0 px-1 pb-1">
          <div
            className="w-full h-2.5 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(100, Math.round(progressRatio * 100))}
            aria-label={`Progress through the ${targetMinutes} minute block`}
          >
            <div
              className={`h-full transition-colors duration-200 ${
                isOvertime
                  ? 'bg-rose-500'
                  : progressRatio >= 0.8
                  ? 'bg-amber-400'
                  : tokens.accent.progressFill
              }`}
              style={{ width: `${Math.min(100, progressRatio * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 100% Opaque Privacy Vault Shield */}
      <AnimatePresence>
        {isCovered && (
          <motion.div
            id="privacy-vault-shield"
            role="group"
            aria-label="Timer display covered"
            initial={prefersReducedMotion ? false : { scale: 0.98 }}
            animate={prefersReducedMotion ? {} : { scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-y-auto ${
              tokens.isDark ? 'bg-black text-white' : 'bg-neutral-900 text-white'
            }`}
          >
            <div className="relative mb-4 sm:mb-6 shrink-0">
              <div
                className={`w-20 h-20 sm:w-28 sm:h-28 ${tokens.buttons.pillRounded} border-2 sm:border-4 border-white/80 flex flex-col items-center justify-center shadow-lg rotate-[-2deg] ${tokens.surface.bg}`}
              >
                <Lock
                  className={`w-10 h-10 sm:w-14 sm:h-14 stroke-[2.5] ${tokens.accent.color} ${tokens.accent.glow}`}
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 ${tokens.buttons.pillRounded} border border-black text-xs sm:text-sm font-black shadow-md ${tokens.accent.badgeBg} ${tokens.accent.badgeText}`}
              >
                {tokens.buttons.bracketStyle ? '[ COVERED ]' : 'COVERED'}
              </div>
            </div>

            <div
              className={`space-y-2 max-w-md p-4 sm:p-6 ${tokens.buttons.pillRounded} border border-white/15 bg-white/5 backdrop-blur-md shadow-xl shrink-0`}
            >
              <h2
                className={`${tokens.typography.fontDisplay} text-xl sm:text-3xl font-black tracking-tight`}
              >
                Timer is Covered
              </h2>
              <p
                className={`${tokens.typography.fontBody} text-xs sm:text-sm text-neutral-300 leading-relaxed`}
              >
                The clock is ticking in the background. Press{' '}
                <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold text-xs">
                  Space
                </kbd>{' '}
                to start or stop it, or reveal below.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onToggleStartStop}
                className={`flex items-center gap-2 px-5 py-2.5 ${tokens.buttons.pillRounded} font-bold text-sm sm:text-base cursor-pointer transition-all ${tokens.buttons.primaryStart}`}
              >
                {status === 'running'
                  ? tokens.buttons.bracketStyle
                    ? '[ STOP (Space) ]'
                    : 'Stop Timer (Space)'
                  : tokens.buttons.bracketStyle
                  ? '[ START (Space) ]'
                  : 'Start Timer (Space)'}
              </button>

              <button
                type="button"
                onClick={onToggleCover}
                className={`flex items-center gap-2 px-5 py-2.5 ${tokens.buttons.pillRounded} font-bold text-sm sm:text-base cursor-pointer transition-all ${tokens.buttons.secondary}`}
              >
                <Eye className="w-4 h-4" />
                <span>
                  {tokens.buttons.bracketStyle
                    ? '[ REVEAL (C) ]'
                    : 'Reveal Timer (C)'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
