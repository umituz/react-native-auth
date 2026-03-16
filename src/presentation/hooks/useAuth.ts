/**
 * useAuth Hook
 * React hook for authentication state management
 * PERFORMANCE: Uses single batch selector to minimize re-renders
 */

import { useCallback } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  selectSetLoading,
  selectSetError,
} from "../stores/auth.selectors";
import {
  calculateUserId,
  calculateHasFirebaseUser,
  calculateIsAnonymous,
  calculateIsAuthenticated,
  calculateUserType,
  calculateIsAuthReady,
} from "../../infrastructure/utils/calculators/authStateCalculator";
import type { UserType } from "../../types/auth-store.types";
import {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useAnonymousModeMutation,
} from "./mutations/useAuthMutations";
import type { AuthUser } from "../../domain/entities/AuthUser";

export interface UseAuthResult {
  user: AuthUser | null;
  userId: string | null;
  userType: UserType;
  loading: boolean;
  isAuthReady: boolean;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  hasFirebaseUser: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAnonymously: () => Promise<void>;
  setError: (error: string | null) => void;
}

export function useAuth(): UseAuthResult {
  // PERFORMANCE: Individual selectors instead of selectAuthState to avoid unstable object references
  // This fixes the 'getSnapshot should be cached' warning in React 19
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const initialized = useAuthStore((s) => s.initialized);

  const setLoading = useAuthStore(selectSetLoading);
  const setError = useAuthStore(selectSetError);

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
        // isAnonymous is automatically derived from firebaseUser by the auth listener
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign up failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, signUpMutation.mutateAsync]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        await signInMutation.mutateAsync({ email, password });
        // isAnonymous is automatically derived from firebaseUser by the auth listener
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign in failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, signInMutation.mutateAsync]
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await signOutMutation.mutateAsync();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, signOutMutation.mutateAsync]);

  const continueAnonymously = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await anonymousModeMutation.mutateAsync();
      // isAnonymous is automatically derived from firebaseUser by the auth listener
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to continue anonymously");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, anonymousModeMutation.mutateAsync]);

  // Derive state (same logic as in selectAuthState but stable within this hook)
  const userId = calculateUserId(firebaseUser);
  const isAuthenticated = calculateIsAuthenticated(firebaseUser);
  const isAnonymous = calculateIsAnonymous(firebaseUser);
  const userType = calculateUserType(firebaseUser);
  const isAuthReady = calculateIsAuthReady(initialized, loading);
  const hasFirebaseUser = calculateHasFirebaseUser(firebaseUser);

  return {
    user,
    userId,
    userType,
    loading,
    isAuthReady,
    isAnonymous,
    isAuthenticated,
    hasFirebaseUser,
    error,
    signUp,
    signIn,
    signOut,
    continueAnonymously,
    setError,
  };
}
