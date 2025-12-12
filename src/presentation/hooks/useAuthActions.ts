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

/**
 * Hook for authentication actions
 */
export function useAuthActions(
  state: UseAuthStateResult
): UseAuthActionsResult {
  const { isGuest, setIsGuest, setLoading, setError } = state;

  const signUp = useCallback(async (
    email: string,
    password: string,
    displayName?: string
  ) => {
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
  }, [isGuest, setIsGuest, setLoading, setError]);

  const signIn = useCallback(async (email: string, password: string) => {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.log("[useAuthActions] signIn called with email:", email);
    }
    const service = getAuthService();
    if (!service) {
      const err = "Auth service is not initialized";
      setError(err);
      throw new Error(err);
    }
    try {
      setLoading(true);
      setError(null);
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] Calling service.signIn()");
      }
      await service.signIn({ email, password });
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] Service.signIn() completed successfully");
      }
      if (isGuest) {
        /* eslint-disable-next-line no-console */
        if (__DEV__) {
          console.log("[useAuthActions] Clearing guest mode after sign in");
        }
        setIsGuest(false);
      }
} catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isGuest, setIsGuest, setLoading, setError]);

  const signOut = useCallback(async () => {
    const service = getAuthService();
    if (!service) {
      return;
    }
    try {
      setLoading(true);
      await service.signOut();
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const continueAsGuest = useCallback(async () => {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.log("========================================");
      console.log("[useAuthActions] 🎯 continueAsGuest() CALLED");
      console.log("[useAuthActions] Current state:", {
        isGuest,
        loading: state.loading,
      });
      console.log("========================================");
    }
    
    const service = getAuthService();
    if (!service) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] ⚠️ No service available, setting isGuest directly");
      }
      setIsGuest(true);
      return;
    }
    
    try {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] Setting loading to true...");
      }
      setLoading(true);
      
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] 📞 Calling service.setGuestMode()...");
      }
      await service.setGuestMode();
      
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] ✅ Service.setGuestMode() completed successfully");
        console.log("[useAuthActions] Setting isGuest to true...");
      }
      
      setIsGuest(true);
      
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] ✅ isGuest set to true");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to continue as guest";
      setError(errorMessage);
      if (__DEV__) {
        console.error("[useAuthActions] ❌ ERROR in continueAsGuest:", error);
        console.error("[useAuthActions] Error details:", {
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
      setIsGuest(true);
    } finally {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] Setting loading to false...");
      }
      setLoading(false);
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useAuthActions] ✅ continueAsGuest() FINISHED");
        console.log("========================================");
      }
    }
  }, [isGuest, setIsGuest, setLoading, state.loading]);

  return {
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };
}

