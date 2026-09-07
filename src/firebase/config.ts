import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { FirebaseConfigOptions } from '../types';

export function getActiveFirebaseConfig(): FirebaseConfigOptions {
  const env =
    (import.meta as unknown as { env?: Record<string, string | undefined> })
      .env || {};

  // Best practice for Firebase Auth on Firebase Hosting:
  // Using the host domain (e.g. cleartimer-55025.web.app) prevents third-party cookie
  // and partitioned storage blocking in modern browsers (Safari ITP, Chrome Privacy Sandbox).
  let authDomain =
    env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || 'cleartimer-55025.web.app';

  if (typeof window !== 'undefined' && window.location.hostname) {
    const host = window.location.hostname;
    if (host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')) {
      authDomain = host;
    }
  }

  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || 'cleartimer-55025',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
  };
}

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  const config = getActiveFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
}

export function getFirebaseApp(): FirebaseApp | null {
  const config = getActiveFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return null;
  }

  try {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp(config);
    }
    return appInstance;
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    return null;
  }
}

export function getDb(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (err) {
    console.warn('Firestore initialization error:', err);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    console.warn('Firebase Auth initialization error:', err);
    return null;
  }
}

