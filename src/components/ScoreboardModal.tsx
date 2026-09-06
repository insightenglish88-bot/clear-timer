import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../hooks/useDialog';
import {
  X,
  Trophy,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Users,
  Clock,
  CheckCircle2,
  Edit2,
  Check,
  FolderPlus,
} from 'lucide-react';
import { Classroom } from '../types';
import { SkinTokens } from '../theme/skins';
import { formatTime } from '../utils/formatTime';

interface ScoreboardModalProps {
  classes: Classroom[];
  activeClassId: string;
  currentElapsedMs: number;
  tokens: SkinTokens;
  onSelectClass: (classId: string) => void;
  onAddClass: (name: string) => void;
  onRenameClass: (classId: string, name: string) => void;
  onRemoveClass: (classId: string) => void;
  onAddTeam: (classId: string, name: string) => void;
  onRemoveTeam: (classId: string, teamId: string) => void;
  onSetTeamTime: (classId: string, teamId: string, timeMs: number) => void;
  onAdjustTeamTime: (classId: string, teamId: string, deltaMs: number) => void;
  onResetClassTimes: (classId: string) => void;
  onClose: () => void;
}

export function ScoreboardModal({
  classes,
  activeClassId,
  currentElapsedMs,
  tokens,
  onSelectClass,
  onAddClass,
  onRenameClass,
  onRemoveClass,
  onAddTeam,
  onRemoveTeam,
  onSetTeamTime,
  onAdjustTeamTime,
  onResetClassTimes,
  onClose,
}: ScoreboardModalProps) {
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newClassName, setNewClassName] = useState<string>('');
  const [isCreatingClass, setIsCreatingClass] = useState<boolean>(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingClassName, setEditingClassName] = useState<string>('');
  const [recordedFeedback, setRecordedFeedback] = useState<string | null>(null);

  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const prefersReducedMotion = useReducedMotion();

  // Active classroom lookup
  const activeClass =
    classes.find((c) => c.id === activeClassId) || classes[0];
  const teams = activeClass ? activeClass.teams : [];

  function handleCreateClass(e: FormEvent) {
    e.preventDefault();
    const name = newClassName.trim();
    if (!name) return;
    onAddClass(name);
    setNewClassName('');
    setIsCreatingClass(false);
  }

  function handleStartRename(c: Classroom) {
    setEditingClassId(c.id);
    setEditingClassName(c.name);
  }

  function handleSaveRename(classId: string) {
    const trimmed = editingClassName.trim();
    if (trimmed) {
      onRenameClass(classId, trimmed);
    }
    setEditingClassId(null);
  }

  function handleAddTeam(e: FormEvent) {
    e.preventDefault();
    if (!activeClass) return;
    const name = newTeamName.trim() || `Team ${teams.length + 1}`;
    onAddTeam(activeClass.id, name);
    setNewTeamName('');
  }

  function handleRecordCurrentTime(teamId: string) {
    if (currentElapsedMs <= 0 || !activeClass) return;
    onSetTeamTime(activeClass.id, teamId, currentElapsedMs);
    setRecordedFeedback(teamId);
    setTimeout(() => setRecordedFeedback(null), 1800);
  }

  // Find teams with recorded times > 0
  const recordedTeams = teams.filter((t) => t.timeMs > 0);
  // Fastest time in this class
  const fastestTime =
    recordedTeams.length > 0
      ? Math.min(...recordedTeams.map((t) => t.timeMs))
      : null;

  const isBracket = !!tokens.buttons.bracketStyle;
  const pillRounded = tokens.buttons.pillRounded;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/75 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scoreboard-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? false : { scale: 0.96 }}
        animate={prefersReducedMotion ? {} : { scale: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col ${pillRounded} border-2 sm:border-4 ${tokens.surface.border} ${tokens.surface.bg} ${tokens.canvas.text} ${tokens.surface.shadow} overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-3.5 sm:p-5 border-b ${tokens.surface.border} bg-black/10 dark:bg-white/5`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 ${pillRounded} flex items-center justify-center shadow-xs ${tokens.accent.badgeBg} ${tokens.accent.badgeText} border ${tokens.accent.badgeBorder}`}
            >
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="scoreboard-title"
                className={`${tokens.typography.fontDisplay} font-bold text-base sm:text-xl leading-tight`}
              >
                {isBracket ? '[ CLASS & TEAM SCOREBOARD ]' : 'Class & Team Scoreboard'}
              </h2>
              <p className="text-xs opacity-75">
                Organize classrooms, record finish times, and track rankings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close scoreboard"
            className={`p-2 ${pillRounded} transition-all cursor-pointer ${tokens.buttons.secondary}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Classes Tabs Bar */}
        <div
          className={`px-3.5 sm:px-5 py-2.5 border-b ${tokens.surface.border} bg-black/5 dark:bg-white/5 flex items-center gap-2 overflow-x-auto`}
        >
          <span className="text-xs font-bold uppercase tracking-wider opacity-60 shrink-0 mr-1">
            Classes:
          </span>

          {classes.map((c) => {
            const isSelected = c.id === activeClass?.id;
            const isEditing = editingClassId === c.id;

            if (isEditing) {
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-1 bg-black/20 dark:bg-white/10 p-1 rounded-xl shrink-0"
                >
                  <input
                    type="text"
                    value={editingClassName}
                    onChange={(e) => setEditingClassName(e.target.value)}
                    autoFocus
                    className="px-2 py-0.5 text-xs font-bold rounded-lg bg-white text-black dark:bg-black dark:text-white border border-black/20 outline-none w-28"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(c.id);
                      if (e.key === 'Escape') setEditingClassId(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveRename(c.id)}
                    className="p-1 text-green-500 hover:text-green-400 cursor-pointer"
                    title="Save name"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingClassId(null)}
                    className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={c.id}
                className={`group flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer select-none shrink-0 ${
                  isSelected
                    ? `${tokens.buttons.primaryStart} shadow-sm ring-1 ring-white/30`
                    : `${tokens.buttons.secondary} opacity-85 hover:opacity-100`
                }`}
                onClick={() => onSelectClass(c.id)}
              >
                <span>{c.name}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({c.teams.length})
                </span>

                {/* Edit Class Name Button */}
                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(c);
                    }}
                    className="opacity-60 hover:opacity-100 p-0.5 cursor-pointer ml-0.5"
                    title="Rename class"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}

                {/* Delete Class Button (if more than 1 class) */}
                {classes.length > 1 && isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          `Delete class "${c.name}" and all its recorded teams?`,
                        )
                      ) {
                        onRemoveClass(c.id);
                      }
                    }}
                    className="opacity-60 hover:opacity-100 hover:text-rose-400 p-0.5 cursor-pointer ml-0.5"
                    title="Delete class"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Class Inline Form / Button */}
          {isCreatingClass ? (
            <form
              onSubmit={handleCreateClass}
              className="flex items-center gap-1 bg-black/20 dark:bg-white/10 p-1 rounded-xl shrink-0"
            >
              <input
                type="text"
                placeholder="Class name (e.g. 5A)..."
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                autoFocus
                className="px-2 py-0.5 text-xs font-bold rounded-lg bg-white text-black dark:bg-black dark:text-white border border-black/20 outline-none w-32"
              />
              <button
                type="submit"
                className="px-2 py-0.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-500 cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingClass(false)}
                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreatingClass(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 ${pillRounded} text-xs font-bold border border-dashed border-white/30 hover:border-white/60 hover:bg-white/5 opacity-80 hover:opacity-100 transition-all cursor-pointer shrink-0`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ New Class</span>
            </button>
          )}
        </div>

        {/* Content Body: Teams within Selected Class */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
          {/* Live Timer Status Banner */}
          <div
            className={`p-3 sm:p-4 ${pillRounded} border ${tokens.surface.border} bg-black/10 dark:bg-white/5 flex flex-wrap items-center justify-between gap-2`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold opacity-80">
                Current Timer:
              </span>
              <span
                className={`${tokens.numerals.fontClass} text-base sm:text-lg font-black ${tokens.numerals.color} tabular-nums px-2.5 py-0.5 rounded-lg bg-black/20 dark:bg-white/10 border ${tokens.surface.border} ${tokens.numerals.glow}`}
              >
                {formatTime(currentElapsedMs)}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs opacity-75">
              Class:{' '}
              <strong className={tokens.accent.color}>
                {activeClass?.name}
              </strong>{' '}
              — Tap &quot;Record Current Time&quot; on any team to lock finish time
            </span>
          </div>

          {/* Add Team Bar */}
          <form
            onSubmit={handleAddTeam}
            className={`p-2.5 sm:p-3 ${pillRounded} border ${tokens.surface.border} bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row items-center gap-2`}
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder={`Team name for ${activeClass?.name} (e.g. Team ${teams.length + 1})...`}
                className={`w-full px-3.5 py-2 ${pillRounded} border ${tokens.surface.border} bg-white dark:bg-neutral-900 text-black dark:text-white text-xs sm:text-sm placeholder:opacity-50 outline-none`}
              />
            </div>
            <button
              type="submit"
              className={`w-full sm:w-auto px-4 sm:px-5 py-2 ${pillRounded} font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${tokens.buttons.primaryStart}`}
            >
              <Plus className="w-4 h-4" />
              <span>
                {isBracket
                  ? `[ ADD TEAM TO ${activeClass?.name.toUpperCase()} ]`
                  : `Add Team to ${activeClass?.name}`}
              </span>
            </button>
          </form>

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <div
              className={`py-12 px-4 ${pillRounded} border-2 border-dashed ${tokens.surface.border} text-center space-y-2`}
            >
              <Users
                className={`w-10 h-10 ${tokens.accent.color} mx-auto opacity-80`}
              />
              <p className="font-bold text-base sm:text-lg">
                No teams in {activeClass?.name} yet!
              </p>
              <p className="text-xs opacity-75 max-w-sm mx-auto">
                Type a team name above and click &quot;Add Team&quot; to begin
                recording times for this class.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {teams.map((team) => {
                const isFastest =
                  fastestTime !== null &&
                  team.timeMs > 0 &&
                  team.timeMs === fastestTime;
                const hasTime = team.timeMs > 0;
                const isJustRecorded = recordedFeedback === team.id;

                return (
                  <div
                    key={team.id}
                    className={`relative p-3.5 sm:p-4 ${pillRounded} border ${
                      tokens.surface.border
                    } bg-black/10 dark:bg-white/5 flex flex-col justify-between transition-all ${
                      isFastest ? 'ring-2 ring-amber-400' : ''
                    }`}
                  >
                    {/* Fastest Team Tag */}
                    {isFastest && (
                      <div className="absolute -top-3 left-4 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Trophy className="w-3 h-3 fill-slate-950" />
                        <span>Fastest Time</span>
                      </div>
                    )}

                    {/* Team Header */}
                    <div className="flex items-start justify-between gap-2 pt-0.5">
                      <h3 className="font-bold text-sm sm:text-base truncate">
                        {team.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveTeam(activeClass.id, team.id)}
                        className="p-1 opacity-60 hover:opacity-100 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Big Team Time Display */}
                    <div
                      className={`my-2.5 py-2 px-3 ${pillRounded} bg-black/20 dark:bg-white/5 border ${tokens.surface.border} text-center`}
                    >
                      {hasTime ? (
                        <span
                          className={`${tokens.numerals.fontClass} text-2xl sm:text-3xl font-black ${tokens.numerals.color} tabular-nums ${tokens.numerals.glow}`}
                        >
                          {formatTime(team.timeMs)}
                        </span>
                      ) : (
                        <span className="font-mono text-xl sm:text-2xl font-bold opacity-40 tabular-nums">
                          -- : -- . --
                        </span>
                      )}
                    </div>

                    {/* Actions: Record Time & Adjustments */}
                    <div className="space-y-1.5">
                      {/* Record Current Time Button */}
                      <button
                        type="button"
                        onClick={() => handleRecordCurrentTime(team.id)}
                        disabled={currentElapsedMs <= 0}
                        className={`w-full py-2 px-3 ${pillRounded} font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                          isJustRecorded
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : currentElapsedMs > 0
                            ? tokens.buttons.primaryStart
                            : `${tokens.buttons.secondary} opacity-40 cursor-not-allowed`
                        }`}
                      >
                        {isJustRecorded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>
                              {isBracket ? '[ TIME RECORDED! ]' : 'Time Recorded!'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>
                              {isBracket
                                ? '[ RECORD CURRENT TIME ]'
                                : 'Record Current Time'}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Adjuster Bar: -1s, +1s, +5s, Clear */}
                      {hasTime && (
                        <div className="flex items-center justify-between gap-1 pt-0.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                onAdjustTeamTime(activeClass.id, team.id, -1000)
                              }
                              className={`py-1 px-2 ${pillRounded} text-[10px] font-bold transition-all cursor-pointer flex items-center ${tokens.buttons.secondary}`}
                              title="Subtract 1 second"
                            >
                              <Minus className="w-3 h-3" />
                              <span>1s</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onAdjustTeamTime(activeClass.id, team.id, 1000)
                              }
                              className={`py-1 px-2 ${pillRounded} text-[10px] font-bold transition-all cursor-pointer flex items-center ${tokens.buttons.secondary}`}
                              title="Add 1 second"
                            >
                              <Plus className="w-3 h-3" />
                              <span>1s</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onAdjustTeamTime(activeClass.id, team.id, 5000)
                              }
                              className={`py-1 px-2 ${pillRounded} text-[10px] font-bold transition-all cursor-pointer flex items-center ${tokens.buttons.secondary}`}
                              title="Add 5 seconds"
                            >
                              <Plus className="w-3 h-3" />
                              <span>5s</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onSetTeamTime(activeClass.id, team.id, 0)
                            }
                            className="py-1 px-2 text-[10px] font-bold opacity-70 hover:opacity-100 hover:underline cursor-pointer flex items-center gap-1"
                            title="Clear this team's time"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Clear</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeClass && (
          <div
            className={`p-3 sm:p-4 border-t ${tokens.surface.border} bg-black/10 dark:bg-white/5 flex items-center justify-between`}
          >
            <span className="text-xs font-bold opacity-75">
              {recordedTeams.length} of {teams.length} Teams Completed in{' '}
              <strong className={tokens.accent.color}>{activeClass.name}</strong>
            </span>
            {teams.length > 0 && (
              <button
                type="button"
                onClick={() => onResetClassTimes(activeClass.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${tokens.buttons.secondary}`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {isBracket
                    ? '[ RESET CLASS TIMES ]'
                    : 'Reset Class Times'}
                </span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
