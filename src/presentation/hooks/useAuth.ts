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

  useEffect(() => {
    try {
      const service = getAuthService();
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
      // Auth service not initialized
      setUser(null);
      setIsGuest(false);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const service = getAuthService();
    await service.signUp({ email, password, displayName });
    // State will be updated via onAuthStateChange
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const service = getAuthService();
    await service.signIn({ email, password });
    // State will be updated via onAuthStateChange
  }, []);

  const signOut = useCallback(async () => {
    const service = getAuthService();
    await service.signOut();
    setUser(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(async () => {
    const service = getAuthService();
    await service.setGuestMode();
    setUser(null);
    setIsGuest(true);
  }, []);

  return {
    user,
    loading,
    isGuest,
    isAuthenticated: !!user && !isGuest,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
  };
}

