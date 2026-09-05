import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FastForward, X } from 'lucide-react';
import { playSound, speakVoice, cancelVoice } from '../utils/audio';
import { SkinTokens } from '../theme/skins';

interface CountdownOverlayProps {
  soundEnabled: boolean;
  tokens: SkinTokens;
  onComplete: () => void;
  onCancel: () => void;
}

export function CountdownOverlay({
  soundEnabled,
  tokens,
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

  const isBracket = !!tokens.buttons.bracketStyle;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="assertive"
      aria-label={count > 0 ? `Starting in ${count}` : 'Go'}
      className={`fixed inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-10 select-none overflow-y-auto ${
        tokens.isDark ? 'bg-black/90 text-white' : 'bg-[#FBF9F5]/95 text-black'
      } backdrop-blur-md`}
    >
      {/* Top Bar: Cancel & Status tag */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full motion-safe:animate-ping"
            style={{ backgroundColor: tokens.previewColors[1] }}
          />
          <span
            className={`${tokens.typography.fontBody} font-bold text-sm tracking-widest uppercase`}
          >
            {isBracket ? '[ GET READY ]' : 'GET READY...'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className={`flex items-center gap-1.5 px-3 py-1.5 ${tokens.buttons.pillRounded} text-xs font-bold transition-all cursor-pointer ${tokens.buttons.secondary}`}
        >
          <X className="w-3.5 h-3.5" />
          <span>{isBracket ? '[ CANCEL ]' : 'Cancel'}</span>
        </button>
      </div>

      {/* Center Countdown Number or GO! */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={count}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 0.3, opacity: 0, rotate: count === 0 ? 0 : -10 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 1.3, opacity: 0, rotate: count === 0 ? 0 : 10 }
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
                <span
                  className={`${tokens.numerals.fontClass} text-[clamp(6rem,min(30vw,45vh),18rem)] leading-none select-none ${tokens.numerals.color} ${tokens.numerals.glow}`}
                >
                  {count}
                </span>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`mt-2 ${tokens.typography.fontBody} font-bold text-base sm:text-xl tracking-wider uppercase opacity-80`}
                >
                  {count === 1 ? 'Ready...' : 'Counting Down...'}
                </motion.p>
              </>
            ) : (
              <>
                <span
                  className={`${tokens.numerals.fontClass} text-[clamp(5rem,min(26vw,38vh),15rem)] leading-none select-none tracking-wider ${tokens.accent.color} ${tokens.accent.glow}`}
                >
                  GO!
                </span>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`mt-2 ${tokens.typography.fontBody} font-black text-xl sm:text-2xl tracking-widest uppercase ${tokens.accent.color}`}
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
          className={`inline-flex items-center gap-2 px-6 py-3 ${tokens.buttons.pillRounded} font-bold text-sm sm:text-base cursor-pointer transition-all ${tokens.buttons.primaryStart}`}
        >
          <FastForward className="w-4 h-4 fill-current" />
          <span>
            {isBracket
              ? '[ SKIP COUNTDOWN & GO ]'
              : 'Skip Countdown & Go!'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
