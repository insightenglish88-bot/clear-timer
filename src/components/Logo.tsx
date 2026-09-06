import { SkinTokens } from '../theme/skins';

interface LogoProps {
  tokens?: SkinTokens;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({
  tokens,
  size = 'md',
  showText = true,
  className = '',
}: LogoProps) {
  const isBracket = tokens ? !!tokens.buttons.bracketStyle : false;

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  };

  const textSizes = {
    sm: { clear: 'text-lg', timer: 'text-base' },
    md: { clear: 'text-2xl sm:text-3xl', timer: 'text-xl sm:text-2xl' },
    lg: { clear: 'text-3xl sm:text-4xl', timer: 'text-2xl sm:text-3xl' },
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Stopwatch Emblem */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}
        title="Clear Timer"
      >
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoIconChrono" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>

            <linearGradient id="logoEmblemBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Squircle Base */}
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill="url(#logoEmblemBg)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Top Crown Pusher */}
          <rect x="29" y="4" width="6" height="4.5" rx="1.5" fill="#64748B" />
          <rect x="27" y="3" width="10" height="2" rx="1" fill="#94A3B8" />

          {/* Angled Side Buttons */}
          <rect
            x="46"
            y="10"
            width="4"
            height="3"
            rx="1"
            transform="rotate(35 48 11.5)"
            fill="#64748B"
          />
          <rect
            x="14"
            y="12"
            width="4"
            height="3"
            rx="1"
            transform="rotate(-35 16 13.5)"
            fill="#64748B"
          />

          {/* Outer Ring Track */}
          <circle cx="32" cy="34" r="20" stroke="#334155" strokeWidth="2.5" strokeOpacity="0.6" />

          {/* Glowing Chrono Arc */}
          <path
            d="M 32 14 A 20 20 0 1 1 17 48"
            stroke="url(#logoIconChrono)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Ticks */}
          <line x1="32" y1="17" x2="32" y2="19.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="49" y1="34" x2="46.5" y2="34" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="51" x2="32" y2="48.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="34" x2="17.5" y2="34" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Pivot & Needle */}
          <circle cx="32" cy="34" r="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
          <line x1="32" y1="34" x2="43" y2="22" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="43" cy="22" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {showText && (
        <div className="flex flex-col">
          {tokens && (
            <div
              className={`w-full h-1 rounded-full mb-0.5 transition-all ${tokens.accent.ruleBg}`}
            />
          )}
          <div className="flex items-baseline gap-1.5 px-0.5">
            <span
              className={`font-black tracking-tight transition-colors ${textSizes[size].clear} ${
                tokens?.accent.color || 'text-sky-400'
              }`}
            >
              clear
            </span>
            <span
              className={`font-bold tracking-tight ${textSizes[size].timer} ${
                tokens?.canvas.text || 'text-slate-100'
              }`}
            >
              timer
            </span>
          </div>
          {tokens && (
            <div
              className={`w-full h-1 rounded-full mt-0.5 transition-all ${tokens.accent.ruleBg}`}
            />
          )}
        </div>
      )}
    </div>
  );
}
