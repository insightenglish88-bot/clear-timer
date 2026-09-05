export type { SkinId } from './theme/skins';
import type { SkinId } from './theme/skins';

export type LearnerMode = 'yle' | 'middle' | 'business';

export interface LapRecord {
  id: string;
  lapNumber: number;
  lapTime: number;
  overallTime: number;
  timestamp: number;
}

export type TimerStatus = 'idle' | 'countdown' | 'running' | 'paused';

export type AppTheme = 'light' | 'dark';

export interface Team {
  id: string;
  name: string;
  timeMs: number; // Recorded time in ms (0 = no time recorded)
}

export interface TimerSession {
  id: string;
  title: string;
  totalMs: number;
  formattedTime: string;
  mode?: string;
  skin?: SkinId;
  laps?: LapRecord[];
  createdAt: number;
  theme?: AppTheme;
}

export interface FirebaseConfigOptions {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}
