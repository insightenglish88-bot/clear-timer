import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from './config';
import { TimerSession } from '../types';

const LOCAL_STORAGE_SESSIONS_KEY = 'clear_timer_saved_sessions';

function getLocalSessions(): TimerSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore error
  }
  return [];
}

function setLocalSessions(sessions: TimerSession[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Ignore error
  }
}

export async function saveSessionToFirebase(
  sessionData: Omit<TimerSession, 'id'>
): Promise<{ success: boolean; id: string; source: 'firestore' | 'local' }> {
  // Always save locally first as resilient backup
  const localId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const fullSession: TimerSession = {
    ...sessionData,
    id: localId,
  };

  const existingLocal = getLocalSessions();
  setLocalSessions([fullSession, ...existingLocal]);

  // If Firebase is configured and online, persist to Firestore
  if (isFirebaseConfigured()) {
    try {
      const db = getDb();
      if (db) {
        const docRef = await addDoc(collection(db, 'timer_sessions'), {
          ...sessionData,
          savedAt: new Date().toISOString(),
        });
        return { success: true, id: docRef.id, source: 'firestore' };
      }
    } catch (error) {
      console.warn('Could not save to Firestore, stored locally:', error);
    }
  }

  return { success: true, id: localId, source: 'local' };
}

export async function fetchSessions(): Promise<{
  sessions: TimerSession[];
  source: 'firestore' | 'local';
}> {
  if (isFirebaseConfigured()) {
    try {
      const db = getDb();
      if (db) {
        const q = query(
          collection(db, 'timer_sessions'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const remoteSessions: TimerSession[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<TimerSession, 'id'>;
          remoteSessions.push({
            id: docSnap.id,
            ...data,
          });
        });

        if (remoteSessions.length > 0) {
          return { sessions: remoteSessions, source: 'firestore' };
        }
      }
    } catch (error) {
      console.warn('Failed to fetch from Firestore, falling back to local:', error);
    }
  }

  return { sessions: getLocalSessions(), source: 'local' };
}

export async function deleteSession(id: string): Promise<boolean> {
  // Delete from local
  const current = getLocalSessions();
  const updated = current.filter((s) => s.id !== id);
  setLocalSessions(updated);

  // Delete from Firestore if connected
  if (isFirebaseConfigured()) {
    try {
      const db = getDb();
      if (db) {
        await deleteDoc(doc(db, 'timer_sessions', id));
      }
    } catch (error) {
      console.warn('Failed to delete from Firestore:', error);
    }
  }

  return true;
}
