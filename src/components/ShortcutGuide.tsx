import { Sparkles } from 'lucide-react';
import { AppTheme } from '../types';

interface ShortcutGuideProps {
  theme: AppTheme;
}

export function ShortcutGuide({ theme }: ShortcutGuideProps) {
  return (
    <div
      id="keyboard-shortcuts-guide"
      className={`w-full pt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-comic font-bold select-none ${
        theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
      }`}
    >
      <div className="flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-[#b91c1c] fill-[#b91c1c]" />
        <span className="text-black dark:text-white">SHORTCUTS:</span>
      </div>

      <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-0.5 rounded-lg border-2 border-black comic-shadow-sm">
        <kbd className="px-1.5 py-0.2 rounded bg-[#b91c1c] text-white font-bold text-[11px]">
          Space
        </kbd>
        <span className="text-black dark:text-white">Start / Stop</span>
      </div>

      <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-0.5 rounded-lg border-2 border-black comic-shadow-sm">
        <kbd className="px-1.5 py-0.2 rounded bg-[#b91c1c] text-white font-bold text-[11px]">
          C
        </kbd>
        <span className="text-black dark:text-white">Cover</span>
      </div>

      <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-2.5 py-0.5 rounded-lg border-2 border-black comic-shadow-sm">
        <kbd className="px-1.5 py-0.2 rounded bg-black text-white dark:bg-white dark:text-black font-bold text-[11px]">
          R
        </kbd>
        <span className="text-black dark:text-white">Reset</span>
      </div>
    </div>
  );
}
