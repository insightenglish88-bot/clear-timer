import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialog } from '../hooks/useDialog';
import {
  X,
  Mic,
  Volume2,
  Play,
  Check,
  Sparkles,
  Sliders,
  RotateCcw,
  Search,
  Zap,
} from 'lucide-react';
import {
  getAvailableVoices,
  VoiceItem,
  previewVoiceCountdown,
  cancelVoice,
  getVoiceRate,
  setVoiceRate,
  getVoicePitch,
  setVoicePitch,
} from '../utils/audio';
import { SkinTokens } from '../theme/skins';

interface VoiceSelectModalProps {
  tokens: SkinTokens;
  selectedVoiceURI: string;
  onSelectVoice: (voiceURI: string) => void;
  onClose: () => void;
}

export function VoiceSelectModal({
  tokens,
  selectedVoiceURI,
  onSelectVoice,
  onClose,
}: VoiceSelectModalProps) {
  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [previewingURI, setPreviewingURI] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'natural' | 'female' | 'male'>('all');

  const [voiceRate, setRateState] = useState<number>(getVoiceRate());
  const [voicePitch, setPitchState] = useState<number>(getVoicePitch());
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Load voices on mount and listen for dynamic browser voice load
  useEffect(() => {
    function load() {
      const v = getAvailableVoices();
      setVoices(v);
    }
    load();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }

    return () => {
      cancelVoice();
    };
  }, []);

  // Filter voices based on category and search query
  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        v.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.accent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === 'natural') return v.isNatural;
      if (filterType === 'female') return v.gender === 'female';
      if (filterType === 'male') return v.gender === 'male';

      return true;
    });
  }, [voices, searchQuery, filterType]);

  function handlePreview(voiceURI: string) {
    if (previewingURI === voiceURI) {
      cancelVoice();
      setPreviewingURI(null);
      return;
    }

    setPreviewingURI(voiceURI);
    previewVoiceCountdown(voiceURI, () => {
      setPreviewingURI(null);
    });
  }

  function handleRateChange(val: number) {
    setRateState(val);
    setVoiceRate(val);
  }

  function handlePitchChange(val: number) {
    setPitchState(val);
    setVoicePitch(val);
  }

  function handleResetSliders() {
    handleRateChange(1.0);
    handlePitchChange(1.0);
  }

  const pillRounded = tokens.buttons.pillRounded;
  const isBracket = !!tokens.buttons.bracketStyle;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden select-none outline-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${tokens.surface.border} ${tokens.surface.bg} ${tokens.canvas.text}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl bg-white/10 ${tokens.accent.color}`}
            >
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="voice-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight"
              >
                {isBracket ? '[ COUNTDOWN VOICE & CRESCENDO ]' : 'Countdown Voice & Crescendo'}
              </h2>
              <p className="text-xs opacity-60">
                Natural speech countdown (5..1) with crescendo swell at GO!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-all cursor-pointer`}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crescendo Feature Highlight Badge */}
        <div className="px-4 sm:px-6 pt-3 pb-1 shrink-0">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">
                Acoustic Escalation &amp; Crescendo at GO:
              </span>{' '}
              Each second (5 down to 1) plays an ascending musical chime scale with natural human voice. At &ldquo;GO!&rdquo;, a dynamic exponential volume and pitch crescendo sweeps into a triumphant fanfare chord!
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by voice name or accent..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border bg-black/20 focus:outline-none focus:border-cyan-400 ${tokens.surface.border} placeholder:opacity-40`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'natural', label: '🌟 Natural' },
              { id: 'female', label: 'Female' },
              { id: 'male', label: 'Male' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as typeof filterType)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer shrink-0 ${
                  filterType === tab.id
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'bg-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Fine Tuning Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                showSettings
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                  : `${tokens.surface.border} bg-white/5 opacity-70 hover:opacity-100`
              }`}
              title="Voice pitch and speed adjustments"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional Speed & Pitch Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 sm:px-6 py-2.5 bg-black/30 border-y border-white/5 shrink-0 overflow-hidden text-xs"
            >
              <div className="flex items-center justify-between pb-2">
                <span className="font-bold opacity-80 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Voice Fine-Tuning
                </span>
                <button
                  type="button"
                  onClick={handleResetSliders}
                  className="inline-flex items-center gap-1 text-[11px] opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] opacity-70 mb-1">
                    <span>Speech Pace (Speed)</span>
                    <span className="font-mono">{voiceRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={voiceRate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] opacity-70 mb-1">
                    <span>Tone Pitch</span>
                    <span className="font-mono">{voicePitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={voicePitch}
                    onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {filteredVoices.length === 0 ? (
            <div className="text-center py-10 opacity-50 text-xs">
              No voices found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredVoices.map((voice) => {
              const isSelected = selectedVoiceURI === voice.voiceURI;
              const isPreviewing = previewingURI === voice.voiceURI;

              return (
                <div
                  key={voice.voiceURI}
                  onClick={() => onSelectVoice(voice.voiceURI)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? `border-cyan-400 bg-cyan-400/10 shadow-sm`
                      : `border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05]`
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400 text-black'
                          : 'border-white/30 group-hover:border-white/60'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm tracking-wide truncate">
                          {voice.displayName}
                        </span>

                        {voice.isNatural && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
                            <Sparkles className="w-2.5 h-2.5" /> Natural HD
                          </span>
                        )}

                        {voice.gender !== 'neutral' && (
                          <span className="text-[10px] uppercase font-semibold opacity-50">
                            {voice.gender}
                          </span>
                        )}
                      </div>

                      <p className="text-xs opacity-50 truncate mt-0.5">
                        {voice.accent} &bull; {voice.lang}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => handlePreview(voice.voiceURI)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isPreviewing
                          ? 'bg-amber-500 text-black shadow-md animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 opacity-80 hover:opacity-100'
                      }`}
                      title="Preview 3..2..1..GO! with crescendo"
                    >
                      {isPreviewing ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                          <span>Playing...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Preview</span>
                        </>
                      )}
                    </button>

                    {/* Select Badge / Button */}
                    <button
                      type="button"
                      onClick={() => onSelectVoice(voice.voiceURI)}
                      className={`px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? tokens.buttons.primaryStart
                          : tokens.buttons.secondary
                      }`}
                    >
                      {isSelected ? 'Active' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-white/10 bg-black/20 shrink-0 text-xs">
          <span className="opacity-60">
            {voices.length} {voices.length === 1 ? 'voice' : 'voices'} available on your system
          </span>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 ${pillRounded} font-bold text-xs cursor-pointer transition-all ${tokens.buttons.secondary}`}
          >
            {isBracket ? '[ DONE ]' : 'Done'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}