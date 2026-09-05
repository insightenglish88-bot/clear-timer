import { Keyboard } from 'lucide-react';
import { SkinTokens } from '../theme/skins';

interface ShortcutGuideProps {
  tokens: SkinTokens;
}

const SHORTCUTS = [
  { key: 'Space', label: 'Start / Stop', accent: true },
  { key: 'C', label: 'Cover', accent: true },
  { key: 'R', label: 'Reset', accent: false },
];

export function ShortcutGuide({ tokens }: ShortcutGuideProps) {
  const isBracket = !!tokens.buttons.bracketStyle;

  return (
    <div
      id="keyboard-shortcuts-guide"
      className={`w-full flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs ${tokens.typography.fontBody} font-bold select-none opacity-80 hover:opacity-100 transition-opacity`}
    >
      <div className="flex items-center gap-1.5">
        <Keyboard className="w-3.5 h-3.5" />
        <span className="tracking-wider uppercase">
          {isBracket ? '[ SHORTCUTS ]' : 'SHORTCUTS:'}
        </span>
      </div>

      {SHORTCUTS.map((s) => (
        <div
          key={s.key}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 ${tokens.buttons.pillRounded} border transition-colors ${tokens.surface.bg} ${tokens.surface.border}`}
        >
          <kbd
            className={`px-1.5 py-0.5 ${tokens.buttons.pillRounded} font-mono font-bold text-[11px] ${
              s.accent
                ? `${tokens.accent.badgeBg} ${tokens.accent.badgeText} border ${tokens.accent.badgeBorder}`
                : 'bg-black/20 dark:bg-white/10 text-inherit border border-black/10 dark:border-white/10'
            }`}
          >
            {s.key}
          </kbd>
          <span className="text-xs">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
