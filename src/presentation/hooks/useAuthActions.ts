import { useCallback } from "react";
import type { UseAuthStateResult } from "./useAuthState";
import {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useGuestModeMutation,
} from "./mutations/useAuthMutations";

export interface UseAuthActionsResult {
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

export function useAuthActions(state: UseAuthStateResult): UseAuthActionsResult {
  const { isGuest, setIsGuest, setLoading, setError } = state;

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
    [isGuest, setIsGuest, setLoading, setError, signUpMutation],
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
    [isGuest, setIsGuest, setLoading, setError, signInMutation],
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
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };
}
