import React, { useState, useEffect } from 'react';
import {
  Presentation,
  Gauge,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { AppTheme, AgendaItem } from '../types';

interface BusinessEnglishPanelProps {
  theme: AppTheme;
  elapsedMs: number;
  /** Rehearsal length the clock counts toward, in minutes. */
  targetMinutes?: number | null;
  onSetTargetMinutes?: (minutes: number | null) => void;
}

export const BusinessEnglishPanel: React.FC<BusinessEnglishPanelProps> = ({
  theme,
  elapsedMs,
  targetMinutes = null,
  onSetTargetMinutes,
}) => {
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
  const [newMinutes, setNewMinutes] = useState<number>(2);

  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_agenda', JSON.stringify(agenda));
    } catch {}
  }, [agenda]);

  const targetMs = targetMinutes !== null ? targetMinutes * 60000 : 0;
  const progressRatio = targetMs > 0 ? elapsedMs / targetMs : 0;

  // Pacing status calculation
  let pacingStatus: { label: string; color: string; icon: React.ReactNode; bg: string } = {
    label: 'On Target',
    color: 'text-emerald-800 dark:text-emerald-300',
    bg: 'bg-emerald-500/10 border-emerald-600/40',
    icon: <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
  };

  if (targetMs === 0) {
    pacingStatus = {
      label: 'No rehearsal length set',
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-500/10 border-slate-500/30',
      icon: <Gauge className="w-4 h-4 text-slate-600 dark:text-slate-300" />,
    };
  } else if (elapsedMs === 0) {
    pacingStatus = {
      label: 'Ready for Rehearsal',
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-500/10 border-slate-500/30',
      icon: <Gauge className="w-4 h-4 text-slate-600 dark:text-slate-300" />,
    };
  } else if (progressRatio > 1.0) {
    const overtimeSec = Math.round((elapsedMs - targetMs) / 1000);
    pacingStatus = {
      label: `Overtime (+${Math.floor(overtimeSec / 60)}m ${overtimeSec % 60}s)`,
      color: 'text-rose-800 dark:text-rose-300',
      bg: 'bg-rose-500/10 border-rose-600/40',
      icon: <AlertTriangle className="w-4 h-4 text-rose-700 dark:text-rose-400" />,
    };
  } else if (progressRatio >= 0.8) {
    pacingStatus = {
      label: 'Wrap-Up Window (Last 20%)',
      color: 'text-amber-900 dark:text-amber-300',
      bg: 'bg-amber-500/15 border-amber-600/40',
      icon: <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />,
    };
  }

  const presets = [
    { label: '2m Elevator Pitch', mins: 2 },
    { label: '5m Lightning Talk', mins: 5 },
    { label: '15m Keynote', mins: 15 },
    { label: '30m Board Review', mins: 30 },
  ];

  const allottedTotal = agenda.reduce((sum, item) => sum + item.allottedMinutes, 0);

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
      className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700 text-slate-100'
          : 'bg-slate-50 border-slate-300 text-slate-900 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-800 text-white dark:bg-slate-700">
            <Presentation className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100">
              Executive Presentation Pacing
            </h3>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              {targetMinutes !== null
                ? `Rehearsing to ${targetMinutes} minutes`
                : 'Open-ended — choose a length below'}
              {' · '}
              {allottedTotal}m allotted across {agenda.length} items
            </p>
          </div>
        </div>

        {/* Dynamic Pacing Badge */}
        <div
          role="status"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${pacingStatus.bg} ${pacingStatus.color}`}
        >
          {pacingStatus.icon}
          <span>{pacingStatus.label}</span>
        </div>
      </div>

      {/* Target Presets. Progress itself is rendered on the clock above, so it
          is not repeated here. */}
      <div
        role="group"
        aria-label="Rehearsal length"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"
      >
        {presets.map((p) => {
          const isSelected = targetMinutes === p.mins;
          return (
            <button
              key={p.mins}
              type="button"
              onClick={() => onSetTargetMinutes?.(isSelected ? null : p.mins)}
              aria-pressed={isSelected}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors border cursor-pointer text-center ${
                isSelected
                  ? 'bg-slate-800 text-white border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-100'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Meeting Agenda Checklist */}
      <ul className="space-y-1.5">
        {agenda.map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-xs transition-colors ${
              item.completed
                ? 'opacity-85 line-through bg-slate-200/50 dark:bg-slate-800/40 border-transparent'
                : theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggleAgenda(item.id)}
              aria-pressed={item.completed}
              className="flex items-center gap-2 text-left flex-1 cursor-pointer font-medium"
            >
              {item.completed ? (
                <CheckSquare className="w-3.5 h-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
              ) : (
                <Square className="w-3.5 h-3.5 shrink-0 text-slate-600 dark:text-slate-300" />
              )}
              <span>
                {index + 1}. {item.topic} ({item.allottedMinutes}m)
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteAgenda(item.id)}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer transition-colors"
              aria-label={`Delete agenda item: ${item.topic}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </li>
        ))}
      </ul>

      {/* Add Topic Form */}
      <form
        onSubmit={handleAddAgenda}
        className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800"
      >
        <label htmlFor="be-new-topic" className="sr-only">
          New agenda topic
        </label>
        <input
          id="be-new-topic"
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="New agenda topic..."
          className={`flex-1 min-w-0 px-3 py-1.5 text-xs rounded-lg border ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
              : 'bg-white border-slate-300 text-black placeholder:text-slate-600'
          }`}
        />
        <label htmlFor="be-new-minutes" className="sr-only">
          Minutes allotted
        </label>
        <input
          id="be-new-minutes"
          type="number"
          min={0.5}
          step={0.5}
          value={newMinutes}
          onChange={(e) => setNewMinutes(Math.max(0.5, Number(e.target.value) || 0.5))}
          className={`w-16 shrink-0 px-2 py-1.5 text-xs rounded-lg border tabular-nums ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-white border-slate-300 text-black'
          }`}
          title="Minutes allotted to this topic"
        />
        <button
          type="submit"
          disabled={!newTopic.trim()}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
