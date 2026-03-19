/**
 * Anonymous Sign-In Types
 */

import type { User } from 'firebase/auth';

export interface AnonymousSignInCallbacks {
  onSignInSuccess: () => void;
  onSignInFailure: (error: Error) => void;
}

export interface AnonymousSignInOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface AnonymousStore {
  setFirebaseUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
}
