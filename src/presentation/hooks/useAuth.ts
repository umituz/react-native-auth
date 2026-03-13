/**
 * useAuth Hook
 * React hook for authentication state management
 */

import { useCallback } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  selectUser,
  selectLoading,
  selectError,
  selectSetLoading,
  selectSetError,
  selectIsAuthenticated,
  selectHasFirebaseUser,
  selectUserId,
  selectUserType,
  selectIsAnonymous,
  selectIsAuthReady,
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
  const user = useAuthStore(selectUser);
  const loading = useAuthStore(selectLoading);
  const error = useAuthStore(selectError);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasFirebaseUser = useAuthStore(selectHasFirebaseUser);
  const userId = useAuthStore(selectUserId);
  const userType = useAuthStore(selectUserType);
  const isAnonymous = useAuthStore(selectIsAnonymous);
  const isAuthReady = useAuthStore(selectIsAuthReady);
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
    user, userId, userType, loading, isAuthReady, isAnonymous, isAuthenticated, hasFirebaseUser, error,
    signUp, signIn, signOut, continueAnonymously, setError,
  };
}
