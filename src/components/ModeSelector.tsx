import React from 'react';
import { Sparkles, BookOpen, Briefcase } from 'lucide-react';
import { LearnerMode, AppTheme } from '../types';

interface ModeSelectorProps {
  currentMode: LearnerMode;
  theme: AppTheme;
  onSelectMode: (mode: LearnerMode) => void;
}

interface ModeConfig {
  id: LearnerMode;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  theme,
  onSelectMode,
}) => {
  const modes: ModeConfig[] = [
    {
      id: 'yle',
      label: 'YLE Learners',
      sublabel: 'Kids & Games',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'middle',
      label: 'Middle School',
      sublabel: 'Focus & Tasks',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'business',
      label: 'Business English',
      sublabel: 'Executive & Pacing',
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

  return (
    <nav
      aria-label="Learner profile mode selector"
      className={`inline-flex p-1.5 rounded-2xl border-2 transition-all shadow-sm ${
        theme === 'dark'
          ? 'bg-neutral-900 border-neutral-700'
          : 'bg-neutral-100 border-neutral-300'
      }`}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;

          // Mode-specific active colors
          let activeClasses = '';
          if (isActive) {
            if (mode.id === 'yle') {
              activeClasses =
                'bg-[#b91c1c] text-white border-2 border-black shadow-[2px_2px_0px_#000] scale-[1.02]';
            } else if (mode.id === 'middle') {
              activeClasses =
                'bg-indigo-600 text-white border-2 border-indigo-950 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] scale-[1.02]';
            } else {
              activeClasses =
                'bg-slate-800 text-white border-2 border-slate-900 shadow-[2px_2px_0px_rgba(0,0,0,0.25)] scale-[1.02]';
            }
          } else {
            activeClasses =
              theme === 'dark'
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-black hover:bg-white/80';
          }

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${activeClasses}`}
              aria-pressed={isActive}
              title={`Switch to ${mode.label} Mode (${mode.sublabel})`}
            >
              <span className="shrink-0">{mode.icon}</span>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-semibold">{mode.label}</span>
                <span
                  className={`text-[10px] hidden md:inline font-normal ${
                    isActive ? 'opacity-90' : 'opacity-70'
                  }`}
                >
                  {mode.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
