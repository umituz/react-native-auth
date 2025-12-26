/**
 * useAuth Hook
 * React hook for authentication state management
 *
 * Uses centralized Zustand store for auth state.
 * Single source of truth - no duplicate subscriptions.
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
 * ```
 */

import { useCallback } from "react";
import { useAuthStore, selectIsAuthenticated } from "../stores/authStore";
import {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useGuestModeMutation,
} from "./mutations/useAuthMutations";
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
 * Uses centralized Zustand store - all components share the same state.
 * Must call initializeAuthListener() once in app root.
 *
 * @example
 * ```typescript
 * const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
 * ```
 */
export function useAuth(): UseAuthResult {
  // State from store
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const isGuest = useAuthStore((state) => state.isGuest);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Actions from store
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setIsGuest = useAuthStore((state) => state.setIsGuest);

  // Mutations
  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  const signOutMutation = useSignOutMutation();
  const guestModeMutation = useGuestModeMutation();

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        setLoading(true);
        setError(null);
        await signUpMutation.mutateAsync({ email, password, displayName });
        if (isGuest) {
          setIsGuest(false);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Sign up failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isGuest, setIsGuest, setLoading, setError, signUpMutation]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        await signInMutation.mutateAsync({ email, password });
        if (isGuest) {
          setIsGuest(false);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Sign in failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isGuest, setIsGuest, setLoading, setError, signInMutation]
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await signOutMutation.mutateAsync();
    } finally {
      setLoading(false);
    }
  }, [setLoading, signOutMutation]);

  const continueAsGuest = useCallback(async () => {
    try {
      setLoading(true);
      await guestModeMutation.mutateAsync();
      setIsGuest(true);
    } catch {
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  }, [setIsGuest, setLoading, guestModeMutation]);

  return {
    user,
    loading,
    isGuest,
    isAuthenticated,
    error,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    setError,
  };
}
