let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundType =
  | 'start'
  | 'stop'
  | 'reset'
  | 'cover'
  | 'countdown'
  | 'celebrate';

export interface VoiceItem {
  voiceURI: string;
  name: string;
  lang: string;
  displayName: string;
  isNatural: boolean;
  accent: string;
  gender: 'female' | 'male' | 'neutral';
}

const STORAGE_KEY_VOICE_URI = 'clear_timer_voice_uri';
const STORAGE_KEY_VOICE_RATE = 'clear_timer_voice_rate';
const STORAGE_KEY_VOICE_PITCH = 'clear_timer_voice_pitch';

/**
 * Parses raw voice names from SpeechSynthesis into clean, human-readable labels
 */
export function cleanVoiceName(name: string): string {
  return name
    .replace(/^Microsoft\s+/i, '')
    .replace(/^Google\s+/i, '')
    .replace(/^Apple\s+/i, '')
    .replace(/\s*\(Natural\)/i, '')
    .replace(/\s*\(Online\)/i, '')
    .replace(/\s*\(Neural\)/i, '')
    .replace(/\s*-\s*English.*$/i, '')
    .trim();
}

/**
 * Returns available browser voices with intelligent deduplication and quality scoring
 */
export function getAvailableVoices(): VoiceItem[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];

  const rawVoices = window.speechSynthesis.getVoices();
  if (!rawVoices || rawVoices.length === 0) return [];

  const processed: VoiceItem[] = rawVoices.map((v) => {
    const nameLower = v.name.toLowerCase();
    const isNatural =
      nameLower.includes('natural') ||
      nameLower.includes('neural') ||
      nameLower.includes('online') ||
      nameLower.includes('google') ||
      nameLower.includes('premium') ||
      nameLower.includes('enhanced') ||
      nameLower.includes('samantha') ||
      nameLower.includes('daniel') ||
      nameLower.includes('karen') ||
      nameLower.includes('aria') ||
      nameLower.includes('guy') ||
      nameLower.includes('jenny');

    let gender: 'female' | 'male' | 'neutral' = 'neutral';
    if (
      nameLower.includes('female') ||
      nameLower.includes('jenny') ||
      nameLower.includes('aria') ||
      nameLower.includes('samantha') ||
      nameLower.includes('karen') ||
      nameLower.includes('zira') ||
      nameLower.includes('sonia') ||
      nameLower.includes('michelle')
    ) {
      gender = 'female';
    } else if (
      nameLower.includes('male') ||
      nameLower.includes('guy') ||
      nameLower.includes('david') ||
      nameLower.includes('daniel') ||
      nameLower.includes('ryan') ||
      nameLower.includes('mark') ||
      nameLower.includes('george') ||
      nameLower.includes('oliver')
    ) {
      gender = 'male';
    }

    let accent = 'English';
    if (v.lang.includes('US') || v.lang.includes('en-US')) accent = 'US English';
    else if (v.lang.includes('GB') || v.lang.includes('en-GB') || v.lang.includes('UK')) accent = 'British English';
    else if (v.lang.includes('AU') || v.lang.includes('en-AU')) accent = 'Australian';
    else if (v.lang.includes('CA') || v.lang.includes('en-CA')) accent = 'Canadian';
    else if (v.lang.startsWith('en')) accent = 'English';
    else accent = v.lang;

    return {
      voiceURI: v.voiceURI,
      name: v.name,
      lang: v.lang,
      displayName: cleanVoiceName(v.name),
      isNatural,
      accent,
      gender,
    };
  });

  // Sort English voices first, natural voices at top
  return processed.sort((a, b) => {
    const aEn = a.lang.startsWith('en') ? 1 : 0;
    const bEn = b.lang.startsWith('en') ? 1 : 0;
    if (aEn !== bEn) return bEn - aEn;

    const aNat = a.isNatural ? 1 : 0;
    const bNat = b.isNatural ? 1 : 0;
    if (aNat !== bNat) return bNat - aNat;

    return a.displayName.localeCompare(b.displayName);
  });
}

/**
 * Gets currently active voice URI from localStorage or detects optimal natural voice
 */
export function getSelectedVoiceURI(): string {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem(STORAGE_KEY_VOICE_URI);
  if (saved) return saved;

  const voices = getAvailableVoices();
  const preferred =
    voices.find((v) => v.isNatural && v.lang.startsWith('en')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0];

  return preferred ? preferred.voiceURI : '';
}

export function setSelectedVoiceURI(uri: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VOICE_URI, uri);
}

export function getVoiceRate(): number {
  if (typeof window === 'undefined') return 1.0;
  const saved = localStorage.getItem(STORAGE_KEY_VOICE_RATE);
  return saved ? parseFloat(saved) || 1.0 : 1.0;
}

export function setVoiceRate(rate: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VOICE_RATE, rate.toString());
}

export function getVoicePitch(): number {
  if (typeof window === 'undefined') return 1.0;
  const saved = localStorage.getItem(STORAGE_KEY_VOICE_PITCH);
  return saved ? parseFloat(saved) || 1.0 : 1.0;
}

export function setVoicePitch(pitch: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_VOICE_PITCH, pitch.toString());
}

export function cancelVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Speaks countdown numbers (5..1) or 'go' with natural cadence and crescendo pitch/volume
 */
export function speakCountdown(
  count: number | 'go',
  enabled = true,
  customVoiceURI?: string,
) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window))
    return;

  try {
    window.speechSynthesis.cancel();

    const isGo = count === 'go' || count === 0;
    const text = isGo ? 'Go!' : String(count);
    const utterance = new SpeechSynthesisUtterance(text);

    const baseRate = getVoiceRate();
    const basePitch = getVoicePitch();

    if (isGo) {
      // At "Go!": Energized, high-impact exclamation to match the musical crescendo
      utterance.rate = Math.min(1.4, baseRate * 1.15);
      utterance.pitch = Math.min(1.5, basePitch * 1.25);
      utterance.volume = 1.0;
    } else {
      // Numbers 5..1: Natural, deliberate cadence with subtle rising anticipation
      const num = typeof count === 'number' ? count : 5;
      const progression = Math.max(0, 5 - num); // 0 (at 5) to 4 (at 1)

      utterance.rate = baseRate; // Natural human cadence, unhurried
      utterance.pitch = Math.min(1.4, basePitch * (1.0 + progression * 0.04));
      utterance.volume = Math.min(1.0, 0.82 + progression * 0.045); // Gradual volume crescendo
    }

    const voices = window.speechSynthesis.getVoices();
    const targetURI = customVoiceURI || getSelectedVoiceURI();

    const matchedVoice =
      voices.find((v) => v.voiceURI === targetURI) ||
      voices.find((v) => v.name === targetURI) ||
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Jenny') ||
            v.name.includes('Guy')),
      ) ||
      voices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang || 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Voice speech synthesis notice:', err);
  }
}

/**
 * Backward compatible voice speaker for arbitrary text
 */
export function speakVoice(text: string, enabled = true) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window))
    return;
  if (text === 'Go!' || text === 'go') {
    speakCountdown('go', enabled);
  } else if (/^[1-5]$/.test(text.trim())) {
    speakCountdown(parseInt(text.trim(), 10), enabled);
  } else {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = getVoiceRate();
      utterance.pitch = getVoicePitch();

      const voices = window.speechSynthesis.getVoices();
      const targetURI = getSelectedVoiceURI();
      const matched = voices.find((v) => v.voiceURI === targetURI);
      if (matched) utterance.voice = matched;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }
}

// Preload voices listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Synthesizes an organic, warm acoustic chime scale for countdown counts 5 down to 1.
 * Uses an ascending melodic pentatonic scale (A4 -> B4 -> C#5 -> E5 -> A5)
 * with volume naturally increasing from count 5 to 1.
 */
export function playCountdownChime(count: number, enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Ascending melodic progression with increasing volume
    const chimeMap: Record<
      number,
      { root: number; harmonic: number; gain: number; decay: number }
    > = {
      5: { root: 440.0, harmonic: 880.0, gain: 0.14, decay: 0.28 }, // A4
      4: { root: 493.88, harmonic: 987.77, gain: 0.18, decay: 0.3 }, // B4
      3: { root: 554.37, harmonic: 1108.73, gain: 0.22, decay: 0.32 }, // C#5
      2: { root: 659.25, harmonic: 1318.51, gain: 0.28, decay: 0.36 }, // E5
      1: { root: 880.0, harmonic: 1760.0, gain: 0.35, decay: 0.42 }, // A5 (anticipatory strike)
    };

    const cfg = chimeMap[count] || {
      root: 440,
      harmonic: 880,
      gain: 0.18,
      decay: 0.3,
    };

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(cfg.root, now);
    osc2.frequency.setValueAtTime(cfg.harmonic, now);

    // Warm acoustic low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    // Fast acoustic strike (4ms attack), smooth exponential decay
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(cfg.gain, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + cfg.decay);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + cfg.decay + 0.02);
    osc2.stop(now + cfg.decay + 0.02);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Synthesizes a dramatic, studio-grade CRESCENDO RISER & TRIUMPHANT BURST at "GO!"
 * Combines an exponential rising pitch/volume swell (0 to 0.28s) that sweeps into
 * a radiant major chord fanfare burst and tactile kick thump.
 */
export function playCrescendoGo(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const riserDuration = 0.28;
    const impactTime = now + riserDuration;

    // -------------------------------------------------------------
    // PHASE 1: THE CRESCENDO RISER (t = 0 to 0.28s)
    // Swells exponentially from low volume/pitch to maximum intensity
    // -------------------------------------------------------------
    const riserOsc1 = ctx.createOscillator();
    const riserOsc2 = ctx.createOscillator();
    const riserGain = ctx.createGain();
    const riserFilter = ctx.createBiquadFilter();

    riserOsc1.type = 'sawtooth';
    riserOsc2.type = 'sine';

    // Exponential pitch sweep up into the climax
    riserOsc1.frequency.setValueAtTime(160, now);
    riserOsc1.frequency.exponentialRampToValueAtTime(740, impactTime);
    riserOsc2.frequency.setValueAtTime(320, now);
    riserOsc2.frequency.exponentialRampToValueAtTime(1480, impactTime);

    // Opening filter sweep
    riserFilter.type = 'lowpass';
    riserFilter.frequency.setValueAtTime(700, now);
    riserFilter.frequency.exponentialRampToValueAtTime(3600, impactTime);

    // Dynamic crescendo volume swell (starts quiet 0.03, rises to 0.42)
    riserGain.gain.setValueAtTime(0.03, now);
    riserGain.gain.exponentialRampToValueAtTime(0.42, impactTime);
    riserGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 0.04);

    riserOsc1.connect(riserFilter);
    riserOsc2.connect(riserFilter);
    riserFilter.connect(riserGain);
    riserGain.connect(ctx.destination);

    riserOsc1.start(now);
    riserOsc2.start(now);
    riserOsc1.stop(impactTime + 0.05);
    riserOsc2.stop(impactTime + 0.05);

    // -------------------------------------------------------------
    // PHASE 2: THE TRIUMPHANT CHORD BURST (t = impactTime)
    // High-sparkle major chord fanfare + sub tactile thump
    // -------------------------------------------------------------
    // Low-end tactile punch
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(140, impactTime);
    kickOsc.frequency.exponentialRampToValueAtTime(45, impactTime + 0.12);
    kickGain.gain.setValueAtTime(0.32, impactTime);
    kickGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 0.14);

    kickOsc.connect(kickGain);
    kickGain.connect(ctx.destination);
    kickOsc.start(impactTime);
    kickOsc.stop(impactTime + 0.15);

    // Brilliant Fanfare Chords: C5 (523), E5 (659), G5 (784), C6 (1046.5), E6 (1318.5)
    const chordFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx >= 3 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, impactTime);

      // Micro-shimmer on high notes
      if (idx >= 3) {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.015, impactTime + 0.05);
      }

      const noteGain = 0.22 / (idx * 0.35 + 1);
      const noteDecay = 0.55 + idx * 0.06;

      gain.gain.setValueAtTime(noteGain, impactTime);
      gain.gain.exponentialRampToValueAtTime(0.001, impactTime + noteDecay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(impactTime);
      osc.stop(impactTime + noteDecay + 0.05);
    });
  } catch (err) {
    console.debug('Crescendo Go audio notice:', err);
  }
}

/**
 * Universal sound player
 */
export function playSound(type: SoundType, enabled = true, count = 1) {
  if (!enabled) return;
  try {
    if (type === 'countdown') {
      playCountdownChime(count, enabled);
      return;
    }

    if (type === 'start') {
      playCrescendoGo(enabled);
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'celebrate') {
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        const noteStart = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);
        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'stop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'cover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.07);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'reset') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Audio playback error fallback
  }
}

/**
 * Previews a selected voice by playing: "3, 2, 1, Go!" accompanied by the crescendo sound
 */
export function previewVoiceCountdown(
  voiceURI: string,
  onComplete?: () => void,
) {
  cancelVoice();
  let step = 3;

  function runStep() {
    if (step > 0) {
      playCountdownChime(step, true);
      speakCountdown(step, true, voiceURI);
      step--;
      setTimeout(runStep, 850);
    } else {
      playCrescendoGo(true);
      speakCountdown('go', true, voiceURI);
      if (onComplete) {
        setTimeout(onComplete, 800);
      }
    }
  }

  runStep();
}
