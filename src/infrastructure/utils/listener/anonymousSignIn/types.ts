/**
 * Anonymous Sign-In Types
 */

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
  setFirebaseUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
}
