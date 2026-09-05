import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FastForward, X } from 'lucide-react';
import { playSound, speakVoice, cancelVoice } from '../utils/audio';
import { AppTheme } from '../types';

interface CountdownOverlayProps {
  soundEnabled: boolean;
  theme: AppTheme;
  onComplete: () => void;
  onCancel: () => void;
}

export function CountdownOverlay({
  soundEnabled,
  theme,
  onComplete,
  onCancel,
}: CountdownOverlayProps) {
  const [count, setCount] = useState<number>(5);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (count > 0) {
      playSound('countdown', soundEnabled, count);
      speakVoice(String(count), soundEnabled);

      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // count === 0: Say "Go!" and finish
      playSound('start', soundEnabled);
      speakVoice('Go!', soundEnabled);

      const finishTimer = setTimeout(() => {
        onComplete();
      }, 650);

      return () => clearTimeout(finishTimer);
    }
  }, [count, soundEnabled, onComplete]);

  function handleSkip() {
    cancelVoice();
    onComplete();
  }

  function handleCancel() {
    cancelVoice();
    onCancel();
  }

  return (
    <motion.div
      /* Opaque on mount for the same reason as the privacy shield: this
         overlay covers the clock, so its visibility must not wait on a frame. */
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="assertive"
      aria-label={count > 0 ? `Starting in ${count}` : 'Go'}
      /* `fixed` rather than `absolute`: the shell has no positioned ancestor,
         so this was silently resolving against the viewport anyway. */
      className={`fixed inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-10 select-none overflow-y-auto ${
        theme === 'dark' ? 'bg-black/95 text-white' : 'bg-white/95 text-black'
      } backdrop-blur-sm`}
    >
      {/* Top Bar: Cancel & Status tag */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#b91c1c] motion-safe:animate-ping" />
          <span className="font-comic font-bold text-sm tracking-wide text-black dark:text-white">
            GET READY...
          </span>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-comic font-bold border-2 border-black bg-white dark:bg-black text-black dark:text-white transition-all cursor-pointer shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <X className="w-3.5 h-3.5 text-[#b91c1c]" />
          Cancel
        </button>
      </div>

      {/* Center 3D Countdown Number or GO! */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={count}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 0.3, opacity: 0, rotate: count === 0 ? 0 : -15 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 1.4, opacity: 0, rotate: count === 0 ? 0 : 10 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 450, damping: 22 }
            }
            className="flex flex-col items-center justify-center"
          >
            {count > 0 ? (
              <>
                <span className="font-chewy text-[clamp(5rem,min(28vw,42vh),16rem)] leading-none terracotta-3d select-none">
                  {count}
                </span>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-2 font-comic font-bold text-base sm:text-xl tracking-wider uppercase text-black dark:text-white"
                >
                  {count === 1 ? 'Get Ready...' : 'Counting Down...'}
                </motion.p>
              </>
            ) : (
              <>
                <span className="font-chewy text-[clamp(4rem,min(24vw,34vh),13rem)] leading-none terracotta-3d select-none tracking-wider">
                  GO!
                </span>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-2 font-comic font-black text-xl sm:text-2xl tracking-widest uppercase text-[#b91c1c]"
                >
                  START!
                </motion.p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex items-center justify-center">
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-comic font-bold text-sm sm:text-base border-3 border-black comic-shadow transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          <FastForward className="w-4 h-4 fill-current" />
          Skip Countdown &amp; Go!
        </button>
      </div>
    </motion.div>
  );
}
