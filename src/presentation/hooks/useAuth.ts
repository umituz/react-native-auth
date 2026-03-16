/**
 * useAuth Hook
 * React hook for authentication state management
 * PERFORMANCE: Uses single batch selector to minimize re-renders
 */

import { useCallback } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  selectAuthState,
  selectSetLoading,
  selectSetError,
} from "../stores/auth.selectors";
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
  // PERFORMANCE: Single batch selector instead of 10 separate selectors
  // This reduces re-renders from 10x to 1x when auth state changes
  const authState = useAuthStore(selectAuthState);
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

  return {
    ...authState,
    signUp, signIn, signOut, continueAnonymously, setError,
  };
}
