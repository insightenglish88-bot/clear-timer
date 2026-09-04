import { AnimatePresence, motion } from 'motion/react';
import { Eye, Lock, Zap, Flame, Smile, Briefcase, BookOpen } from 'lucide-react';
import { formatTimeParts } from '../utils/formatTime';
import { TimerStatus, AppTheme, LearnerMode } from '../types';

interface TimerDisplayProps {
  elapsedMs: number;
  status: TimerStatus;
  isCovered: boolean;
  theme: AppTheme;
  mode?: LearnerMode;
  onToggleCover: () => void;
  onToggleStartStop: () => void;
}

export function TimerDisplay({
  elapsedMs,
  status,
  isCovered,
  theme,
  mode = 'yle',
  onToggleCover,
  onToggleStartStop,
}: TimerDisplayProps) {
  const { hours, minutes, seconds, hundredths, hasHours } =
    formatTimeParts(elapsedMs);

  // Dynamic styling per learner profile
  const isBusiness = mode === 'business';
  const isMiddle = mode === 'middle';

  const containerBorder = isBusiness
    ? 'border-slate-700/80 shadow-[6px_6px_0px_rgba(15,23,42,0.6)]'
    : isMiddle
    ? 'border-indigo-600 shadow-[6px_6px_0px_rgba(67,56,202,0.4)]'
    : 'border-[#b91c1c] shadow-[8px_8px_0px_#000000]';

  const accentColor = isBusiness
    ? 'text-slate-700 dark:text-slate-300'
    : isMiddle
    ? 'text-indigo-600 dark:text-indigo-400'
    : 'text-[#b91c1c]';

  const fontClass = isBusiness
    ? 'font-mono tracking-tight'
    : isMiddle
    ? 'font-sans tracking-tight font-extrabold'
    : 'font-cartoon';

  return (
    <div
      id="timer-display-container"
      className={`relative w-full flex-1 flex flex-col items-center justify-center rounded-3xl sm:rounded-[2.5rem] border-4 sm:border-[5px] p-3 sm:p-6 overflow-hidden select-none transition-all duration-200 ${containerBorder} ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Background Subtle Red/Indigo/Slate Grid */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-10 ${
          isBusiness
            ? 'bg-[radial-gradient(#475569_2px,transparent_2px)]'
            : isMiddle
            ? 'bg-[radial-gradient(#6366f1_2px,transparent_2px)]'
            : 'bg-[radial-gradient(#b91c1c_2px,transparent_2px)]'
        } [background-size:24px_24px]`}
      />

      {/* Top Status Header */}
      <div className="absolute top-3 sm:top-4 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none z-10">
        <div
          className={`flex items-center gap-2 bg-white dark:bg-neutral-900 border-2 px-3.5 py-1 rounded-full shadow-sm ${
            isBusiness
              ? 'border-slate-500'
              : isMiddle
              ? 'border-indigo-600'
              : 'border-[#b91c1c]'
          }`}
        >
          {status === 'running' ? (
            <Zap className={`w-4 h-4 fill-current ${accentColor} animate-bounce`} />
          ) : status === 'countdown' ? (
            <Flame className={`w-4 h-4 fill-current ${accentColor} animate-pulse`} />
          ) : isBusiness ? (
            <Briefcase className="w-4 h-4 text-slate-500" />
          ) : isMiddle ? (
            <BookOpen className="w-4 h-4 text-indigo-500" />
          ) : (
            <Smile className="w-4 h-4 text-black dark:text-white" />
          )}
          <span className="font-comic text-xs sm:text-sm font-bold tracking-wide uppercase text-black dark:text-white">
            {status === 'running'
              ? 'RUNNING'
              : status === 'countdown'
              ? 'STARTING...'
              : status === 'paused'
              ? 'PAUSED'
              : 'READY'}
          </span>
        </div>

        <div className="text-xs font-bold text-black dark:text-white bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border-2 border-black shadow-sm">
          <span>Clear Timer</span>
        </div>
      </div>

      {/* Main Screen-Filling Numerals */}
      <div
        id="digital-clock-face"
        onClick={onToggleStartStop}
        className="w-full h-full flex-1 flex items-center justify-center tracking-tighter tabular-nums leading-none select-none font-black px-2 cursor-pointer transition-transform active:scale-[0.99]"
        title="Click or press Space to start/stop"
      >
        {hasHours ? (
          <div className="flex items-baseline justify-center flex-nowrap w-full">
            <span
              className={`${fontClass} text-[clamp(2.8rem,13vw,18vw)] font-black ${accentColor} drop-shadow-sm`}
            >
              {hours}
            </span>
            <span
              className={`font-comic text-[clamp(2rem,9vw,12vw)] font-black ${accentColor} mx-[0.03em]`}
            >
              :
            </span>
            <span
              className={`${fontClass} text-[clamp(2.8rem,13vw,18vw)] font-black ${
                theme === 'dark' ? 'text-white' : 'text-black'
              } drop-shadow-sm`}
            >
              {minutes}
            </span>
            <span
              className={`font-comic text-[clamp(2rem,9vw,12vw)] font-black ${accentColor} mx-[0.03em]`}
            >
              :
            </span>
            <span
              className={`${fontClass} text-[clamp(2.8rem,13vw,18vw)] font-black ${
                theme === 'dark' ? 'text-white' : 'text-black'
              } drop-shadow-sm`}
            >
              {seconds}
            </span>
            <span
              className={`font-comic text-[clamp(1.8rem,7vw,10vw)] font-black ${accentColor} ml-[0.03em] mr-[0.01em]`}
            >
              .
            </span>
            <span
              className={`${fontClass} text-[clamp(1.8rem,8vw,11vw)] font-black ${accentColor}`}
            >
              {hundredths}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline justify-center flex-nowrap w-full">
            <span
              className={`${fontClass} text-[clamp(3.8rem,19vw,27vw)] font-black ${
                theme === 'dark' ? 'text-white' : 'text-black'
              } drop-shadow-sm`}
            >
              {minutes}
            </span>
            <span
              className={`font-comic text-[clamp(2.8rem,14vw,20vw)] font-black ${accentColor} mx-[0.03em]`}
            >
              :
            </span>
            <span
              className={`${fontClass} text-[clamp(3.8rem,19vw,27vw)] font-black ${
                theme === 'dark' ? 'text-white' : 'text-black'
              } drop-shadow-sm`}
            >
              {seconds}
            </span>
            <span
              className={`font-comic text-[clamp(2.2rem,10vw,14vw)] font-black ${accentColor} ml-[0.03em] mr-[0.01em]`}
            >
              .
            </span>
            <span
              className={`${fontClass} text-[clamp(2.4rem,12vw,17vw)] font-black ${accentColor}`}
            >
              {hundredths}
            </span>
          </div>
        )}
      </div>

      {/* 100% Opaque Privacy Shield */}
      <AnimatePresence>
        {isCovered && (
          <motion.div
            id="privacy-vault-shield"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black select-none cursor-pointer"
            onClick={onToggleStartStop}
            title="Click or press Space to start/stop while covered"
          >
            <div className="relative mb-4 sm:mb-6">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white flex flex-col items-center justify-center shadow-[6px_6px_0px_#ffffff] rotate-[-3deg] ${
                  isBusiness
                    ? 'bg-slate-800'
                    : isMiddle
                    ? 'bg-indigo-600'
                    : 'bg-[#b91c1c]'
                }`}
              >
                <Lock className="w-12 h-12 sm:w-14 sm:h-14 text-white stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-black text-xs sm:text-sm font-comic font-black px-2.5 py-0.5 rounded-full border-2 border-black rotate-[8deg] shadow-[2px_2px_0px_#000]">
                COVERED
              </div>
            </div>

            <div className="space-y-2 max-w-md bg-white text-black p-4 sm:p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000]">
              <h2 className="font-comic text-2xl sm:text-3xl font-black tracking-tight">
                Timer is Covered!
              </h2>
              <p className="font-comic text-xs sm:text-sm font-bold text-neutral-700 leading-snug">
                The clock is actively ticking in secret. Click anywhere or press{' '}
                <kbd className="bg-neutral-100 text-black px-1.5 py-0.5 rounded border border-black font-mono font-bold text-xs">
                  Space
                </kbd>{' '}
                to start/stop.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCover();
              }}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black border-4 border-black font-comic font-black text-sm sm:text-base shadow-[4px_4px_0px_#000] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Eye className="w-5 h-5" />
              <span>Reveal Timer (C)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
