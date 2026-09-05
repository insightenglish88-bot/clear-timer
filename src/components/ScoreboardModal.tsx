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
} from 'lucide-react';
import { Team, AppTheme } from '../types';
import { formatTime } from '../utils/formatTime';

interface ScoreboardModalProps {
  teams: Team[];
  currentElapsedMs: number;
  theme: AppTheme;
  onAddTeam: (name: string) => void;
  onRemoveTeam: (id: string) => void;
  onSetTeamTime: (id: string, timeMs: number) => void;
  onAdjustTeamTime: (id: string, deltaMs: number) => void;
  onResetAllTimes: () => void;
  onClose: () => void;
}

export function ScoreboardModal({
  teams,
  currentElapsedMs,
  theme,
  onAddTeam,
  onRemoveTeam,
  onSetTeamTime,
  onAdjustTeamTime,
  onResetAllTimes,
  onClose,
}: ScoreboardModalProps) {
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [recordedFeedback, setRecordedFeedback] = useState<string | null>(null);
  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const prefersReducedMotion = useReducedMotion();

  function handleAddTeam(e: FormEvent) {
    e.preventDefault();
    const name = newTeamName.trim() || `Team ${teams.length + 1}`;
    onAddTeam(name);
    setNewTeamName('');
  }

  function handleRecordCurrentTime(teamId: string) {
    if (currentElapsedMs <= 0) return;
    onSetTeamTime(teamId, currentElapsedMs);
    setRecordedFeedback(teamId);
    setTimeout(() => setRecordedFeedback(null), 1800);
  }

  // Find teams with recorded times > 0
  const recordedTeams = teams.filter((t) => t.timeMs > 0);
  // The fastest team has the lowest non-zero timeMs
  const fastestTime =
    recordedTeams.length > 0 ? Math.min(...recordedTeams.map((t) => t.timeMs)) : null;

  return (
    /* The backdrop is both the motion element and the component's root, so
       AnimatePresence tracks this subtree directly rather than through a plain
       wrapper div. `initial={false}` keeps the dialog visible on first paint. */
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm select-none"
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
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border-4 border-[#b91c1c] ${
          theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
        } shadow-[8px_8px_0px_#000000] overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-[#b91c1c] bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#b91c1c] text-white flex items-center justify-center shadow-sm">
              <Clock className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <h2 id="scoreboard-title" className="font-comic font-bold text-lg sm:text-2xl text-[#b91c1c] leading-tight">
                Team Time Scoreboard
              </h2>
              <p className="text-xs font-comic text-neutral-700 dark:text-neutral-300">
                Record and compare finish times for each team
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close the team scoreboard"
            className="p-2 rounded-xl border-2 border-black hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#b91c1c]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Live Timer Status Banner */}
          <div className="p-3 sm:p-4 rounded-2xl border-2 border-black bg-neutral-50 dark:bg-neutral-900 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <span className="font-comic font-bold text-xs sm:text-sm text-neutral-700 dark:text-neutral-200">
                Current Timer:
              </span>
              <span className="font-mono text-base sm:text-lg font-black text-[#b91c1c] tabular-nums bg-white dark:bg-black px-2.5 py-0.5 rounded-lg border border-black">
                {formatTime(currentElapsedMs)}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-comic text-neutral-700 dark:text-neutral-300">
              Tap &quot;Record Current Time&quot; on any team to log their time
            </span>
          </div>

          {/* Add Team Bar */}
          <form
            onSubmit={handleAddTeam}
            className="p-3 sm:p-3.5 rounded-2xl border-3 border-black bg-white dark:bg-neutral-900 flex flex-col sm:flex-row items-center gap-2.5 shadow-[4px_4px_0px_#000000]"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder={`Team name (e.g. Team ${teams.length + 1})...`}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-black bg-white dark:bg-black font-comic text-sm text-black dark:text-white placeholder:text-neutral-600 dark:placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-comic font-bold text-sm border-2 border-black comic-shadow transition-transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team</span>
            </button>
          </form>

          {/* Teams Grid */}
          {teams.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl border-2 border-dashed border-black text-center space-y-2">
              <Users className="w-10 h-10 text-[#b91c1c] mx-auto" />
              <p className="font-comic font-bold text-black dark:text-white text-base">
                No teams added yet!
              </p>
              <p className="font-comic text-xs text-neutral-700 dark:text-neutral-300">
                Type a name above and click &quot;Add Team&quot; to begin your time scoreboard.
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
                    className={`relative p-4 rounded-2xl border-3 border-black bg-white dark:bg-neutral-900 flex flex-col justify-between shadow-[4px_4px_0px_#000000] transition-all ${
                      isFastest ? 'ring-2 ring-[#b91c1c]' : ''
                    }`}
                  >
                    {/* Fastest Team Tag */}
                    {isFastest && (
                      <div className="absolute -top-3.5 left-4 bg-[#b91c1c] text-white px-2.5 py-0.5 rounded-full border-2 border-black font-comic font-black text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_#000] flex items-center gap-1">
                        <Trophy className="w-3 h-3 fill-white" />
                        <span>Fastest Time</span>
                      </div>
                    )}

                    {/* Team Header */}
                    <div className="flex items-start justify-between gap-2 pt-1">
                      <h3 className="font-comic font-bold text-base sm:text-lg text-black dark:text-white truncate">
                        {team.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveTeam(team.id)}
                        className="p-1 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-[#b91c1c] transition-colors cursor-pointer"
                        title="Remove Team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Big Team Time Display */}
                    <div className="my-3 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-black border-2 border-black text-center">
                      {hasTime ? (
                        <span className="font-mono text-3xl sm:text-4xl font-black text-[#b91c1c] tabular-nums drop-shadow-sm">
                          {formatTime(team.timeMs)}
                        </span>
                      ) : (
                        <span className="font-mono text-2xl sm:text-3xl font-bold text-neutral-600 dark:text-neutral-400 tabular-nums">
                          -- : -- . --
                        </span>
                      )}
                    </div>

                    {/* Actions: Record Time & Adjustments */}
                    <div className="space-y-2">
                      {/* Record Current Time Button */}
                      <button
                        type="button"
                        onClick={() => handleRecordCurrentTime(team.id)}
                        disabled={currentElapsedMs <= 0}
                        className={`w-full py-2 px-3 rounded-xl font-comic font-bold text-xs sm:text-sm border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                          isJustRecorded
                            ? 'bg-black text-white'
                            : currentElapsedMs > 0
                            ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-white comic-shadow-sm'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 cursor-not-allowed opacity-60'
                        }`}
                      >
                        {isJustRecorded ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Time Recorded!</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Record Current Time</span>
                          </>
                        )}
                      </button>

                      {/* Adjuster Bar: -1s, +1s, +5s, Clear */}
                      {hasTime && (
                        <div className="flex items-center justify-between gap-1 pt-0.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onAdjustTeamTime(team.id, -1000)}
                              className="py-1 px-2 rounded-lg border-2 border-black bg-white dark:bg-black text-black dark:text-white font-comic font-bold text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 cursor-pointer flex items-center"
                              title="Subtract 1 second"
                            >
                              <Minus className="w-3 h-3" />
                              <span>1s</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAdjustTeamTime(team.id, 1000)}
                              className="py-1 px-2 rounded-lg border-2 border-black bg-white dark:bg-black text-black dark:text-white font-comic font-bold text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 cursor-pointer flex items-center"
                              title="Add 1 second"
                            >
                              <Plus className="w-3 h-3" />
                              <span>1s</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAdjustTeamTime(team.id, 5000)}
                              className="py-1 px-2 rounded-lg border-2 border-black bg-white dark:bg-black text-[#b91c1c] font-comic font-bold text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 cursor-pointer flex items-center"
                              title="Add 5 seconds"
                            >
                              <Plus className="w-3 h-3" />
                              <span>5s</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onSetTeamTime(team.id, 0)}
                            className="py-1 px-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-[#b91c1c] font-comic text-[11px] font-bold flex items-center gap-1 hover:underline cursor-pointer"
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
        {teams.length > 0 && (
          <div className="p-3 sm:p-4 border-t-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
            <span className="text-xs font-comic font-bold text-neutral-700 dark:text-neutral-300">
              {recordedTeams.length} of {teams.length} Teams Completed
            </span>
            <button
              type="button"
              onClick={onResetAllTimes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-comic font-bold text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#b91c1c]" />
              Reset All Times
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
