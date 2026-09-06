import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDb } from './config';
import { Classroom } from '../types';

export async function saveClassesToCloud(
  userId: string,
  classes: Classroom[],
): Promise<boolean> {
  if (!userId) return false;

  const db = getDb();
  if (!db) {
    console.warn('Firestore database is not initialized');
    return false;
  }

  try {
    const docRef = doc(db, 'user_classes', userId);
    await setDoc(
      docRef,
      {
        classes,
        updatedAt: Date.now(),
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error('Error saving classes to Firestore:', error);
    return false;
  }
}

export async function loadClassesFromCloud(
  userId: string,
): Promise<Classroom[] | null> {
  if (!userId) return null;

  const db = getDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'user_classes', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (Array.isArray(data.classes)) {
        return data.classes as Classroom[];
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading classes from Firestore:', error);
    return null;
  }
}
