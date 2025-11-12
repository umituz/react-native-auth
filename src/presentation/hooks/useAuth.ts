/**
 * useAuth Hook
 * React hook for authentication state management
 */

import { useEffect, useState, useCallback } from "react";
import type { User } from "firebase/auth";
import { getAuthService } from "../../infrastructure/services/AuthService";

export interface UseAuthResult {
  /** Current authenticated user */
  user: User | null;
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
}

/**
 * Hook for authentication state management
 * 
 * @example
 * ```typescript
 * const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
 * ```
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const service = getAuthService();
    if (!service) {
      // Auth service not initialized
      setUser(null);
      setIsGuest(false);
      setLoading(false);
      return () => {};
    }

    try {
      const unsubscribe = service.onAuthStateChange((currentUser) => {
        setUser(currentUser);
        setIsGuest(service.getIsGuestMode());
        setLoading(false);
      });

      // Set initial state
      const currentUser = service.getCurrentUser();
      setUser(currentUser);
      setIsGuest(service.getIsGuestMode());
      setLoading(false);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      // Auth service error
      setUser(null);
      setIsGuest(false);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const service = getAuthService();
    if (!service) {
      const err = "Auth service is not initialized";
      setError(err);
      throw new Error(err);
    }
    try {
      setError(null);
      await service.signUp({ email, password, displayName });
      // State will be updated via onAuthStateChange
    } catch (err: any) {
      const errorMessage = err.message || "Sign up failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const service = getAuthService();
    if (!service) {
      const err = "Auth service is not initialized";
      setError(err);
      throw new Error(err);
    }
    try {
      setError(null);
      await service.signIn({ email, password });
      // State will be updated via onAuthStateChange
    } catch (err: any) {
      const errorMessage = err.message || "Sign in failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    const service = getAuthService();
    if (!service) {
      return;
    }
    await service.signOut();
    setUser(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(async () => {
    const service = getAuthService();
    if (!service) {
      setIsGuest(true);
      return;
    }
    await service.setGuestMode();
    setUser(null);
    setIsGuest(true);
  }, []);

  return {
    user,
    loading,
    isGuest,
    isAuthenticated: !!user && !isGuest,
    error,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };
}

