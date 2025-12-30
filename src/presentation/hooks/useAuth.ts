/**
 * useAuth Hook
 * React hook for authentication state management
 *
 * Uses centralized Zustand store for auth state.
 * Single source of truth - no duplicate subscriptions.
 */

import { useCallback } from "react";
import {
  useAuthStore,
  selectUser,
  selectLoading,
  selectError,
  selectSetLoading,
  selectSetError,
  selectSetIsAnonymous,
  selectIsAuthenticated,
  selectUserId,
  selectUserType,
  selectIsAnonymous,
  selectIsAuthReady,
  type UserType,
} from "../stores/authStore";
import {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useAnonymousModeMutation,
} from "./mutations/useAuthMutations";
import type { AuthUser } from "../../domain/entities/AuthUser";

export interface UseAuthResult {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Current user ID (uid) */
  userId: string | null;
  /** Current user type */
  userType: UserType;
  /** Whether auth state is loading */
  loading: boolean;
  /** Whether auth is ready (initialized and not loading) */
  isAuthReady: boolean;
  /** Whether user is anonymous */
  isAnonymous: boolean;
  /** Whether user is authenticated (not anonymous) */
  isAuthenticated: boolean;
  /** Current error message */
  error: string | null;
  /** Sign up function */
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  /** Sign in function */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out function */
  signOut: () => Promise<void>;
  /** Continue anonymously function */
  continueAnonymously: () => Promise<void>;
  /** Set error manually (for form validation, etc.) */
  setError: (error: string | null) => void;
}

/**
 * Hook for authentication state management
 *
 * Uses centralized Zustand store - all components share the same state.
 * Must call initializeAuthListener() once in app root.
 */
export function useAuth(): UseAuthResult {
  // State from store - using typed selectors
  const user = useAuthStore(selectUser);
  const loading = useAuthStore(selectLoading);
  const error = useAuthStore(selectError);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userId = useAuthStore(selectUserId);
  const userType = useAuthStore(selectUserType);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const isAuthReady = useAuthStore(selectIsAuthReady);

  // Actions from store - using typed selectors
  const setLoading = useAuthStore(selectSetLoading);
  const setError = useAuthStore(selectSetError);
  const setIsAnonymous = useAuthStore(selectSetIsAnonymous);

  // Mutations
  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  const signOutMutation = useSignOutMutation();
  const anonymousModeMutation = useAnonymousModeMutation();

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        setLoading(true);
        setError(null);
        await signUpMutation.mutateAsync({ email, password, displayName });
        setIsAnonymous(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Sign up failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setIsAnonymous, setLoading, setError, signUpMutation]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        await signInMutation.mutateAsync({ email, password });
        setIsAnonymous(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Sign in failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setIsAnonymous, setLoading, setError, signInMutation]
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOutMutation.mutateAsync();
    } finally {
      setLoading(false);
    }
  }, [setLoading, signOutMutation]);

  const continueAnonymously = useCallback(async () => {
    try {
      setLoading(true);
      await anonymousModeMutation.mutateAsync();
      setIsAnonymous(true);
    } catch {
      setIsAnonymous(true);
    } finally {
      setLoading(false);
    }
  }, [setIsAnonymous, setLoading, anonymousModeMutation]);

  return {
    user,
    userId,
    userType,
    loading,
    isAuthReady,
    isAnonymous,
    isAuthenticated,
    error,
    signUp,
    signIn,
    signOut,
    continueAnonymously,
    setError,
  };
}
