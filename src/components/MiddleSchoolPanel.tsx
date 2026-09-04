import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Clock, Flame } from 'lucide-react';
import { AppTheme, FocusTask } from '../types';

interface MiddleSchoolPanelProps {
  theme: AppTheme;
  elapsedMs: number;
  onSetPresetDuration?: (minutes: number) => void;
}

export const MiddleSchoolPanel: React.FC<MiddleSchoolPanelProps> = ({
  theme,
  elapsedMs,
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
  const [newTaskMins, setNewTaskMins] = useState(25);

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
      durationMinutes: newTaskMins,
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

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border-2 transition-all shadow-md ${
        theme === 'dark'
          ? 'bg-neutral-900/90 border-indigo-900/60 text-white'
          : 'bg-indigo-50/70 border-indigo-200 text-neutral-900'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Flame className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-sm sm:text-base text-indigo-900 dark:text-indigo-200 tracking-tight">
            Study Blocks & Tasks
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          {completedCount} / {tasks.length} Completed
        </span>
      </div>

      {/* Interval Block Quick Presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((p) => (
          <button
            key={p.mins}
            type="button"
            onClick={() => onSetPresetDuration?.(p.mins)}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
              theme === 'dark'
                ? 'bg-neutral-800 hover:bg-indigo-900/40 border-neutral-700 text-indigo-200'
                : 'bg-white hover:bg-indigo-100/70 border-indigo-200 text-indigo-800 shadow-sm'
            }`}
            title={`Set timer to ${p.mins} minutes`}
          >
            <Clock className="w-3 h-3" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              task.completed
                ? 'opacity-60 bg-neutral-200/50 dark:bg-neutral-800/40 border-transparent line-through'
                : theme === 'dark'
                ? 'bg-neutral-800 border-neutral-700 hover:border-indigo-500'
                : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggleTask(task.id)}
              className="flex items-center gap-2.5 text-left flex-1 cursor-pointer"
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-neutral-400 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium">{task.title}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteTask(task.id)}
              className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Task Input */}
      <form onSubmit={handleAddTask} className="flex gap-2 mt-3 pt-3 border-t border-indigo-200/50 dark:border-neutral-800">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New study task..."
          className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            theme === 'dark'
              ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
              : 'bg-white border-indigo-200 text-black placeholder-neutral-400'
          }`}
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
