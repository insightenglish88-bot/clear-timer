import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Check your Firebase configuration.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    // Handle popup closed by user gracefully
    if (
      firebaseError.code === 'auth/popup-closed-by-user' ||
      firebaseError.code === 'auth/cancelled-popup-request'
    ) {
      return null;
    }
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void,
): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  return auth ? auth.currentUser : null;
}
