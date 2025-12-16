/**
 * useAuthActions Hook
 * Single Responsibility: Handle authentication actions
 */

import { useCallback } from "react";
import { getAuthService } from "../../infrastructure/services/AuthService";
import type { UseAuthStateResult } from "./useAuthState";

export interface UseAuthActionsResult {
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

export function useAuthActions(state: UseAuthStateResult): UseAuthActionsResult {
  const { isGuest, setIsGuest, setLoading, setError } = state;

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const service = getAuthService();
      if (!service) {
        const err = "Auth service is not initialized";
        setError(err);
        throw new Error(err);
      }
      try {
        setLoading(true);
        setError(null);
        await service.signUp({ email, password, displayName });
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
    [isGuest, setIsGuest, setLoading, setError],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const service = getAuthService();
      if (!service) {
        const err = "Auth service is not initialized";
        setError(err);
        throw new Error(err);
      }
      try {
        setLoading(true);
        setError(null);
        await service.signIn({ email, password });
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
    [isGuest, setIsGuest, setLoading, setError],
  );

  const signOut = useCallback(async () => {
    const service = getAuthService();
    if (!service) return;

    try {
      setLoading(true);
      await service.signOut();
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const continueAsGuest = useCallback(async () => {
    const service = getAuthService();
    if (!service) {
      setIsGuest(true);
      return;
    }

    try {
      setLoading(true);
      await service.setGuestMode();
      setIsGuest(true);
    } catch {
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  }, [setIsGuest, setLoading]);

  return {
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };
}
