import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unknown authentication error occurred.';
  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError.code || '';
  const message = firebaseError.message || '';

  if (
    code === 'auth/configuration-not-found' ||
    message.includes('CONFIGURATION_NOT_FOUND')
  ) {
    return 'Firebase Authentication is not yet activated in the Firebase Console. Please visit the Firebase Console for project "cleartimer-55025", click "Get Started" under Authentication, and enable the Google provider.';
  }

  if (
    code === 'auth/operation-not-allowed' ||
    message.includes('OPERATION_NOT_ALLOWED')
  ) {
    return 'Google Sign-In is not enabled for this project. Please enable Google under Authentication > Sign-in method in the Firebase Console.';
  }

  if (
    code === 'auth/unauthorized-domain' ||
    message.includes('unauthorized domain')
  ) {
    return 'This domain is not authorized for Google Sign-In. Add this domain to Authentication > Settings > Authorized domains in the Firebase Console.';
  }

  if (
    code === 'auth/popup-blocked' ||
    message.includes('popup-blocked')
  ) {
    return 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
  }

  if (code === 'auth/network-request-failed') {
    return 'Network connection failed. Please check your internet connection.';
  }

  return message || 'Google sign-in could not be completed. Please try again.';
}

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
    // Handle popup closed by user gracefully without throwing
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
