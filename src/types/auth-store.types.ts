/**
 * Auth Store Types
 * Type definitions for auth state management
 */

import type { User } from "firebase/auth";
import type { AuthUser } from "../domain/entities/AuthUser";

/**
 * User type classification
 */
export type UserType = "authenticated" | "anonymous" | "none";

/**
 * Auth state interface
 */
export interface AuthState {
  /** Mapped AuthUser (null if not authenticated) */
  user: AuthUser | null;
  /** Raw Firebase user reference */
  firebaseUser: User | null;
  /** Loading state during auth operations */
  loading: boolean;
  /** Anonymous mode (user using anonymous auth) */
  isAnonymous: boolean;
  /** Error message from last auth operation */
  error: string | null;
  /** Whether auth listener has initialized */
  initialized: boolean;
}

/**
 * Auth store actions interface
 */
export interface AuthActions {
  /** Update user from Firebase listener */
  setFirebaseUser: (user: User | null) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set anonymous mode */
  setIsAnonymous: (isAnonymous: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Mark as initialized */
  setInitialized: (initialized: boolean) => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Initial auth state
 */
export const initialAuthState: AuthState = {
  user: null,
  firebaseUser: null,
  loading: true,
  isAnonymous: false,
  error: null,
  initialized: false,
};

/**
 * Auth listener initialization options
 */
export interface AuthListenerOptions {
  /** Enable auto anonymous sign-in when no user is logged in */
  autoAnonymousSignIn?: boolean;
  /** Callback when auth state changes */
  onAuthStateChange?: (user: User | null) => void;
}
