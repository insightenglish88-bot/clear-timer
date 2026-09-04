import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Clock,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchSessions,
  saveSessionToFirebase,
  deleteSession,
} from '../firebase/sessions';
import { TimerSession, AppTheme, LearnerMode } from '../types';
import { formatTime } from '../utils/formatTime';

interface SessionsModalProps {
  currentElapsedMs: number;
  theme: AppTheme;
  mode?: LearnerMode;
  onClose: () => void;
  onLoadSession?: (session: TimerSession) => void;
}

export function SessionsModal({
  currentElapsedMs,
  theme,
  mode = 'yle',
  onClose,
}: SessionsModalProps) {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadSessionsList();
  }, []);

  async function loadSessionsList() {
    setLoading(true);
    try {
      const res = await fetchSessions();
      setSessions(res.sessions);
    } catch (err) {
      console.warn('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCurrent() {
    if (currentElapsedMs <= 0) return;

    const title =
      sessionTitle.trim() ||
      `Clear Timer Session #${sessions.length + 1} (${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })})`;

    const result = await saveSessionToFirebase({
      title,
      totalMs: currentElapsedMs,
      formattedTime: formatTime(currentElapsedMs),
      createdAt: Date.now(),
      mode,
      theme,
    });

    if (result.success) {
      setSaveSuccess(true);
      setSessionTitle('');
      setTimeout(() => setSaveSuccess(false), 2500);
      loadSessionsList();
    }
  }

  async function handleDelete(id: string) {
    await deleteSession(id);
    loadSessionsList();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border-4 border-[#b91c1c] ${
          theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
        } shadow-[8px_8px_0px_#000000] overflow-hidden`}
      >
        {/* Clean Header without Firebase config buttons or status tags */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-[#b91c1c] bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#b91c1c] text-white flex items-center justify-center font-cartoon font-bold shadow-sm">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-comic font-bold text-lg sm:text-xl text-[#b91c1c] leading-tight">
                Clear Timer Sessions
              </h2>
              <p className="text-xs font-comic text-neutral-500">
                Saved practice and lesson timings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border-2 border-black hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#b91c1c]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Quick Save Current Session Form */}
          {currentElapsedMs > 0 && (
            <div className="p-3 sm:p-4 rounded-2xl border-3 border-[#b91c1c] bg-white dark:bg-neutral-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#000]">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Save className="w-4 h-4 text-[#b91c1c]" />
                  <span className="font-comic font-bold text-sm text-[#b91c1c]">
                    Save Current Timer Session
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white dark:bg-black rounded-md border border-black text-black dark:text-white">
                    {formatTime(currentElapsedMs)}
                  </span>
                </div>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="Session name (e.g. Lesson #1)..."
                  className="w-full px-3 py-1.5 rounded-xl border-2 border-black bg-white dark:bg-black font-comic text-xs sm:text-sm text-black dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveCurrent}
                className="px-4 py-2 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-comic font-bold text-xs sm:text-sm border-2 border-black comic-shadow transition-transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Session</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-2">
            <h3 className="font-comic font-bold text-sm text-black dark:text-white uppercase tracking-wider">
              Saved Sessions ({sessions.length})
            </h3>

            {loading ? (
              <div className="py-8 text-center text-sm font-comic text-neutral-500">
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl border-2 border-dashed border-black text-center space-y-1">
                <Clock className="w-8 h-8 text-[#b91c1c] mx-auto" />
                <p className="font-comic font-bold text-black dark:text-white text-sm">
                  No sessions saved yet!
                </p>
                <p className="font-comic text-xs text-neutral-500">
                  Run the timer and tap &quot;Save Session&quot; to preserve your timing records.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-2xl border-2 border-black bg-white dark:bg-neutral-900 flex items-center justify-between gap-3 hover:border-[#b91c1c] transition-all shadow-[2px_2px_0px_#000]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-comic font-bold text-sm sm:text-base text-black dark:text-white">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-comic text-neutral-500">
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()} at{' '}
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base sm:text-xl font-black text-[#b91c1c] tabular-nums">
                        {item.formattedTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-black dark:text-white hover:text-[#b91c1c] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
