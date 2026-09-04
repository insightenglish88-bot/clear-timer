import React, { useState, useEffect } from 'react';
import { Presentation, Gauge, CheckSquare, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { AppTheme, AgendaItem } from '../types';

interface BusinessEnglishPanelProps {
  theme: AppTheme;
  elapsedMs: number;
}

export const BusinessEnglishPanel: React.FC<BusinessEnglishPanelProps> = ({
  theme,
  elapsedMs,
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number>(5);
  const [agenda, setAgenda] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_agenda');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', topic: 'Executive Summary & Problem Statement', allottedMinutes: 1, completed: false },
      { id: '2', topic: 'Market Opportunity & Strategic Value', allottedMinutes: 2, completed: false },
      { id: '3', topic: 'Financial Forecast & Unit Economics', allottedMinutes: 1.5, completed: false },
      { id: '4', topic: 'Call to Action & Q&A Transition', allottedMinutes: 0.5, completed: false },
    ];
  });

  const [newTopic, setNewTopic] = useState('');
  const [newMinutes, setNewMinutes] = useState(2);

  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_agenda', JSON.stringify(agenda));
    } catch {}
  }, [agenda]);

  const targetMs = targetMinutes * 60 * 1000;
  const progressRatio = targetMs > 0 ? elapsedMs / targetMs : 0;
  const progressPercent = Math.min(100, Math.round(progressRatio * 100));

  // Pacing status calculation
  let pacingStatus: { label: string; color: string; icon: React.ReactNode; bg: string } = {
    label: 'On Target',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  };

  if (elapsedMs === 0) {
    pacingStatus = {
      label: 'Ready for Rehearsal',
      color: 'text-neutral-500 dark:text-neutral-400',
      bg: 'bg-neutral-500/10 border-neutral-500/20',
      icon: <Gauge className="w-4 h-4 text-neutral-400" />,
    };
  } else if (progressRatio > 1.0) {
    const overtimeSec = Math.round((elapsedMs - targetMs) / 1000);
    pacingStatus = {
      label: `Overtime (+${Math.floor(overtimeSec / 60)}m ${overtimeSec % 60}s)`,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    };
  } else if (progressRatio >= 0.8) {
    pacingStatus = {
      label: 'Wrap-Up Window (Last 20%)',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    };
  }

  const presets = [
    { label: '2m Elevator Pitch', mins: 2 },
    { label: '5m Lightning Talk', mins: 5 },
    { label: '15m Keynote', mins: 15 },
    { label: '30m Board Review', mins: 30 },
  ];

  const handleToggleAgenda = (id: string) => {
    setAgenda((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    setAgenda((prev) => [
      ...prev,
      {
        id: `agenda-${Date.now()}`,
        topic: newTopic.trim(),
        allottedMinutes: newMinutes,
        completed: false,
      },
    ]);
    setNewTopic('');
  };

  const handleDeleteAgenda = (id: string) => {
    setAgenda((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border-2 transition-all shadow-md ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700/60 text-slate-100'
          : 'bg-slate-50/80 border-slate-300 text-slate-900'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-800 text-white dark:bg-slate-700">
            <Presentation className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100">
              Executive Presentation Pacing
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Target Duration: {targetMinutes} minutes
            </p>
          </div>
        </div>

        {/* Dynamic Pacing Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${pacingStatus.bg} ${pacingStatus.color}`}
        >
          {pacingStatus.icon}
          <span>{pacingStatus.label}</span>
        </div>
      </div>

      {/* Target Presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((p) => {
          const isSelected = targetMinutes === p.mins;
          return (
            <button
              key={p.mins}
              type="button"
              onClick={() => setTargetMinutes(p.mins)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer text-center ${
                isSelected
                  ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Real-time Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
          <span>Progress: {progressPercent}%</span>
          <span>Target: {targetMinutes}:00</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressRatio > 1.0
                ? 'bg-rose-500'
                : progressRatio >= 0.8
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, progressRatio * 100)}%` }}
          />
        </div>
      </div>

      {/* Meeting Agenda Checklist */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        {agenda.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
              item.completed
                ? 'opacity-50 line-through bg-slate-200/40 dark:bg-slate-800/40 border-transparent'
                : theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggleAgenda(item.id)}
              className="flex items-center gap-2 text-left flex-1 cursor-pointer font-medium"
            >
              <CheckSquare
                className={`w-3.5 h-3.5 shrink-0 ${
                  item.completed ? 'text-emerald-500' : 'text-slate-400'
                }`}
              />
              <span>
                {index + 1}. {item.topic} ({item.allottedMinutes}m)
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteAgenda(item.id)}
              className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Topic Form */}
      <form onSubmit={handleAddAgenda} className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="New agenda topic..."
          className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-500 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
              : 'bg-white border-slate-200 text-black placeholder-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={!newTopic.trim()}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
