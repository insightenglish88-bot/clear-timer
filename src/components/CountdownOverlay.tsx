import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FastForward, X, Mic, Zap } from 'lucide-react';
import {
  playCountdownChime,
  playCrescendoGo,
  speakCountdown,
  cancelVoice,
  cleanVoiceName,
} from '../utils/audio';
import { SkinTokens } from '../theme/skins';

interface CountdownOverlayProps {
  soundEnabled: boolean;
  tokens: SkinTokens;
  selectedVoiceURI?: string;
  onOpenVoiceModal?: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export function CountdownOverlay({
  soundEnabled,
  tokens,
  selectedVoiceURI,
  onOpenVoiceModal,
  onComplete,
  onCancel,
}: CountdownOverlayProps) {
  const [count, setCount] = useState<number>(5);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (count > 0) {
      // Harmonic chime with volume/pitch ascending scale + natural voice
      playCountdownChime(count, soundEnabled);
      speakCountdown(count, soundEnabled, selectedVoiceURI);

      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // count === 0: Dynamic Crescendo Riser & Triumphant Fanfare at GO!
      playCrescendoGo(soundEnabled);
      speakCountdown('go', soundEnabled, selectedVoiceURI);

      const finishTimer = setTimeout(() => {
        onComplete();
      }, 850);

      return () => clearTimeout(finishTimer);
    }
  }, [count, soundEnabled, selectedVoiceURI, onComplete]);

  function handleSkip() {
    cancelVoice();
    onComplete();
  }

  function handleCancel() {
    cancelVoice();
    onCancel();
  }

  const isBracket = !!tokens.buttons.bracketStyle;
  const voiceLabel = selectedVoiceURI ? cleanVoiceName(selectedVoiceURI) : 'Natural';

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="assertive"
      aria-label={count > 0 ? `Starting in ${count}` : 'Go'}
      className={`fixed inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-10 select-none overflow-hidden ${
        tokens.isDark ? 'bg-black/92 text-white' : 'bg-[#FBF9F5]/96 text-black'
      } backdrop-blur-md`}
    >
      {/* Top Bar: Cancel, Voice selection & Status tag */}
      <div className="w-full flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full motion-safe:animate-ping"
            style={{ backgroundColor: tokens.previewColors[1] }}
          />
          <span
            className={`${tokens.typography.fontBody} font-bold text-xs sm:text-sm tracking-widest uppercase`}
          >
            {isBracket ? '[ GET READY ]' : 'GET READY...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Selector Pill */}
          {onOpenVoiceModal && (
            <button
              type="button"
              onClick={onOpenVoiceModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${tokens.buttons.pillRounded} text-xs font-semibold transition-all cursor-pointer bg-white/10 hover:bg-white/20`}
              title="Change countdown voice"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline opacity-70">Voice:</span>
              <span className="font-bold truncate max-w-[100px] sm:max-w-[140px]">
                {voiceLabel}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCancel}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${tokens.buttons.pillRounded} text-xs font-bold transition-all cursor-pointer ${tokens.buttons.secondary}`}
          >
            <X className="w-3.5 h-3.5" />
            <span>{isBracket ? '[ CANCEL ]' : 'Cancel'}</span>
          </button>
        </div>
      </div>

      {/* Center Countdown Number or GO! with Visual Crescendo Shockwave */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
        {/* Visual Crescendo Expanding Pulse Ring for 5..1 */}
        {count > 0 && !prefersReducedMotion && (
          <motion.div
            key={`pulse-ring-${count}`}
            initial={{ scale: 0.85, opacity: 0.45 }}
            animate={{ scale: 1.25 + (5 - count) * 0.12, opacity: 0 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            className="absolute pointer-events-none rounded-full border-2 border-cyan-400/40"
            style={{
              width: '240px',
              height: '240px',
            }}
          />
        )}

        {/* Visual Crescendo Shockwave Burst at GO! */}
        {count === 0 && !prefersReducedMotion && (
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 0.9 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute pointer-events-none rounded-full border-4 border-amber-400"
              style={{
                width: '260px',
                height: '260px',
                boxShadow: '0 0 100px rgba(251, 191, 36, 0.7)',
              }}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.05 }}
              className="absolute pointer-events-none rounded-full border-2 border-cyan-400"
              style={{
                width: '260px',
                height: '260px',
              }}
            />
          </>
        )}

        <AnimatePresence mode="popLayout">
          <motion.div
            key={count}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: count === 0 ? 0.2 : 0.4, opacity: 0, rotate: count === 0 ? 0 : -8 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { scale: count === 0 ? 1.12 : 1, opacity: 1, rotate: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { scale: 1.35, opacity: 0, rotate: count === 0 ? 0 : 8 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 460, damping: 20 }
            }
            className="flex flex-col items-center justify-center z-10"
          >
            {count > 0 ? (
              <>
                <span
                  className={`${tokens.numerals.fontClass} text-[clamp(6rem,min(30vw,45vh),18rem)] leading-none select-none ${tokens.numerals.color} ${tokens.numerals.glow}`}
                >
                  {count}
                </span>

                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-1.5 mt-2"
                >
                  <span
                    className={`${tokens.typography.fontBody} font-bold text-sm sm:text-lg tracking-wider uppercase opacity-80`}
                  >
                    {count === 1 ? 'Ready...' : 'Building Up...'}
                  </span>
                  {count === 1 && (
                    <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <span
                  className={`${tokens.numerals.fontClass} text-[clamp(5.5rem,min(28vw,42vh),17rem)] leading-none select-none tracking-wider text-amber-400 drop-shadow-[0_0_40px_rgba(251,191,36,0.8)]`}
                >
                  GO!
                </span>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`mt-3 ${tokens.typography.fontBody} font-black text-2xl sm:text-3xl tracking-widest uppercase text-amber-300 flex items-center gap-2`}
                >
                  <Zap className="w-6 h-6 text-amber-400 fill-current animate-pulse" />
                  START!
                </motion.p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex items-center justify-center z-10">
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

