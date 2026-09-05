import { Keyboard } from 'lucide-react';
import { AppTheme, LearnerMode } from '../types';

interface ShortcutGuideProps {
  theme: AppTheme;
  mode?: LearnerMode;
}

const SHORTCUTS = [
  { key: 'Space', label: 'Start / Stop', accent: true },
  { key: 'C', label: 'Cover', accent: true },
  { key: 'R', label: 'Reset', accent: false },
];

export function ShortcutGuide({ theme, mode = 'yle' }: ShortcutGuideProps) {
  const accentBg =
    mode === 'business'
      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
      : mode === 'middle'
      ? 'bg-indigo-600 text-white'
      : 'bg-[#b91c1c] text-white';

  const border =
    mode === 'business'
      ? 'border-slate-700 dark:border-slate-400'
      : mode === 'middle'
      ? 'border-indigo-900 dark:border-indigo-300'
      : 'border-black';

  return (
    <div
      id="keyboard-shortcuts-guide"
      className={`w-full flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-comic font-bold select-none ${
        theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
      }`}
    >
      <div className="flex items-center gap-1">
        <Keyboard className="w-3.5 h-3.5" />
        <span className="text-black dark:text-white">SHORTCUTS:</span>
      </div>

      {SHORTCUTS.map((s) => (
        <div
          key={s.key}
          className={`flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-0.5 rounded-lg border-2 ${border} comic-shadow-sm`}
        >
          <kbd
            className={`px-1.5 py-0.5 rounded font-bold text-[11px] ${
              s.accent
                ? accentBg
                : 'bg-black text-white dark:bg-white dark:text-black'
            }`}
          >
            {s.key}
          </kbd>
          <span className="text-black dark:text-white">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
