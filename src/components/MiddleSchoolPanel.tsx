import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Clock, Flame } from 'lucide-react';
import { AppTheme, FocusTask } from '../types';

interface MiddleSchoolPanelProps {
  theme: AppTheme;
  elapsedMs: number;
  /** Currently selected block length, in minutes. */
  targetMinutes?: number | null;
  onSetPresetDuration?: (minutes: number | null) => void;
}

export const MiddleSchoolPanel: React.FC<MiddleSchoolPanelProps> = ({
  theme,
  elapsedMs,
  targetMinutes = null,
  onSetPresetDuration,
}) => {
  const [tasks, setTasks] = useState<FocusTask[]>(() => {
    try {
      const saved = localStorage.getItem('clear_timer_ms_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: '1', title: 'English Essay Outline (25m)', completed: false, durationMinutes: 25 },
      { id: '2', title: 'Grammar Exercises Review (10m)', completed: true, durationMinutes: 10 },
      { id: '3', title: 'Reading Comprehension Passage (15m)', completed: false, durationMinutes: 15 },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('clear_timer_ms_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: FocusTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      durationMinutes: targetMinutes ?? 25,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const presets = [
    { label: '25m Focus', mins: 25 },
    { label: '5m Break', mins: 5 },
    { label: '15m Drill', mins: 15 },
    { label: '45m Study', mins: 45 },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;

  const targetMs = targetMinutes !== null ? targetMinutes * 60000 : 0;
  const blockDone = targetMs > 0 && elapsedMs >= targetMs;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border-2 transition-colors shadow-md ${
        theme === 'dark'
          ? 'bg-neutral-900/90 border-indigo-900/60 text-white'
          : 'bg-indigo-50/70 border-indigo-200 text-neutral-900'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Flame className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-sm sm:text-base text-indigo-900 dark:text-indigo-200 tracking-tight">
            Study Blocks &amp; Tasks
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 whitespace-nowrap">
          {completedCount} / {tasks.length} Completed
        </span>
      </div>

      {/* Interval Block Quick Presets — these set the block the clock counts
          toward, and are reflected in the timer display above. */}
      <div
        role="group"
        aria-label="Study block length"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4"
      >
        {presets.map((p) => {
          const isSelected = targetMinutes === p.mins;
          return (
            <button
              key={p.mins}
              type="button"
              onClick={() => onSetPresetDuration?.(isSelected ? null : p.mins)}
              aria-pressed={isSelected}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors border flex items-center justify-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-800 shadow-sm'
                  : theme === 'dark'
                  ? 'bg-neutral-800 hover:bg-indigo-900/40 border-neutral-700 text-indigo-100'
                  : 'bg-white hover:bg-indigo-100/70 border-indigo-200 text-indigo-900 shadow-sm'
              }`}
              title={
                isSelected
                  ? `Clear the ${p.mins} minute block`
                  : `Count toward ${p.mins} minutes`
              }
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {blockDone && (
        <p className="mb-3 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
          Block complete — {targetMinutes} minutes done. Press R to reset, or pick a break.
        </p>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="py-6 text-center text-xs font-medium text-neutral-700 dark:text-neutral-300">
            No tasks yet. Add the first thing you want to get through this block.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                task.completed
                  ? 'opacity-85 bg-neutral-200/50 dark:bg-neutral-800/40 border-transparent line-through'
                  : theme === 'dark'
                  ? 'bg-neutral-800 border-neutral-700 hover:border-indigo-500'
                  : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleTask(task.id)}
                aria-pressed={task.completed}
                className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-neutral-600 dark:text-neutral-300 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium">{task.title}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-neutral-600 dark:text-neutral-300 hover:text-rose-700 dark:hover:text-rose-400 rounded transition-colors cursor-pointer"
                aria-label={`Delete task: ${task.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input */}
      <form onSubmit={handleAddTask} className="flex gap-2 mt-3 pt-3 border-t border-indigo-200/50 dark:border-neutral-800">
        <label htmlFor="ms-new-task" className="sr-only">
          New study task
        </label>
        <input
          id="ms-new-task"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New study task..."
          className={`flex-1 px-3 py-1.5 text-xs rounded-xl border ${
            theme === 'dark'
              ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400'
              : 'bg-white border-indigo-300 text-black placeholder:text-neutral-600'
          }`}
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
