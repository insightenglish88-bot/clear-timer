import { SKINS, SkinId, SkinTokens } from '../theme/skins';

interface SkinSelectorProps {
  currentSkin: SkinId;
  onSelectSkin: (skinId: SkinId) => void;
  tokens: SkinTokens;
}

const SKIN_KEYS: SkinId[] = [
  'executive',
  'retro',
  'cyberpunk',
  'paper',
  'ocean',
  'sunset',
];

export function SkinSelector({
  currentSkin,
  onSelectSkin,
  tokens,
}: SkinSelectorProps) {
  return (
    <nav
      id="skin-selector-nav"
      aria-label="Theme Skin Selector"
      className="flex items-center gap-1 p-1 rounded-2xl sm:rounded-full bg-black/20 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md overflow-x-auto max-w-full"
    >
      {SKIN_KEYS.map((id) => {
        const skin = SKINS[id];
        const isSelected = id === currentSkin;
        const [c1, c2, c3] = skin.previewColors;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectSkin(id)}
            title={`${skin.name} — ${skin.tagline}`}
            className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
              isSelected
                ? 'bg-white text-black dark:bg-neutral-800 dark:text-white shadow-sm ring-2 ring-white/40 dark:ring-white/20'
                : 'text-neutral-400 hover:text-white dark:hover:text-white hover:bg-white/10'
            }`}
          >
            {/* 3 Preview Swatch Dots */}
            <span
              aria-hidden="true"
              className="flex items-center -space-x-1 shrink-0"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs inline-block"
                style={{ backgroundColor: c1 }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs inline-block z-1"
                style={{ backgroundColor: c2 }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs inline-block z-2"
                style={{ backgroundColor: c3 }}
              />
            </span>

            {/* Label */}
            <span
              className={`tracking-tight ${
                isSelected ? 'font-black' : 'font-medium'
              }`}
            >
              {skin.name.split(' ')[0]}
            </span>

            {/* Subtle Active Indicator Dot */}
            {isSelected && (
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: c3 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
