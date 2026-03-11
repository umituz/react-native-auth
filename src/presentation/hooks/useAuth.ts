/**
 * useAuth Hook
 * React hook for authentication state management
 */

import { useCallback, useRef } from "react";
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

  // Store mutateAsync in refs to avoid recreating callbacks on every render.
  // useMutation returns a new object each render, but mutateAsync is stable.
  const signUpMutateRef = useRef(signUpMutation.mutateAsync);
  signUpMutateRef.current = signUpMutation.mutateAsync;
  const signInMutateRef = useRef(signInMutation.mutateAsync);
  signInMutateRef.current = signInMutation.mutateAsync;
  const signOutMutateRef = useRef(signOutMutation.mutateAsync);
  signOutMutateRef.current = signOutMutation.mutateAsync;
  const anonymousMutateRef = useRef(anonymousModeMutation.mutateAsync);
  anonymousMutateRef.current = anonymousModeMutation.mutateAsync;

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        setLoading(true);
        setError(null);
        await signUpMutateRef.current({ email, password, displayName });
        // isAnonymous is automatically derived from firebaseUser by the auth listener
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign up failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        await signInMutateRef.current({ email, password });
        // isAnonymous is automatically derived from firebaseUser by the auth listener
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign in failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await signOutMutateRef.current();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const continueAnonymously = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await anonymousMutateRef.current();
      // isAnonymous is automatically derived from firebaseUser by the auth listener
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to continue anonymously");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    user, userId, userType, loading, isAuthReady, isAnonymous, isAuthenticated, hasFirebaseUser, error,
    signUp, signIn, signOut, continueAnonymously, setError,
  };
}
