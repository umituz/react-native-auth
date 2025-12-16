/**
 * useAuth Hook
 * React hook for authentication state management
 *
 * Uses provider-agnostic AuthUser type.
 * Adds app-specific state (guest mode, error handling) on top of provider auth.
 */

import { useAuthState } from "./useAuthState";
import { useAuthActions } from "./useAuthActions";
import type { AuthUser } from "../../domain/entities/AuthUser";

export interface UseAuthResult {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Whether auth state is loading */
  loading: boolean;
  /** Whether user is in guest mode */
  isGuest: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current error message */
  error: string | null;
  /** Sign up function */
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  /** Sign in function */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out function */
  signOut: () => Promise<void>;
  /** Continue as guest function */
  continueAsGuest: () => Promise<void>;
  /** Set error manually (for form validation, etc.) */
  setError: (error: string | null) => void;
}

/**
 * Hook for authentication state management
 * 
 * Uses Firebase Auth's built-in state management and adds app-specific features:
 * - Guest mode support
 * - Error handling
 * - Loading states
 * 
 * @example
 * ```typescript
 * const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
 * ```
 */
export function useAuth(): UseAuthResult {
  const state = useAuthState();
  const actions = useAuthActions(state);

  return {
    user: state.user,
    loading: state.loading,
    isGuest: state.isGuest,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    signUp: actions.signUp,
    signIn: actions.signIn,
    signOut: actions.signOut,
    continueAsGuest: actions.continueAsGuest,
    setError: state.setError,
  };
}
