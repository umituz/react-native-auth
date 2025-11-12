/**
 * useAuth Hook
 * React hook for authentication state management
 * 
 * Uses Firebase Auth's built-in state management via useFirebaseAuth hook.
 * Adds app-specific state (guest mode, error handling) on top of Firebase Auth.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import type { User } from "firebase/auth";
import { getAuthService } from "../../infrastructure/services/AuthService";
import { useFirebaseAuth } from "@umituz/react-native-firebase-auth";

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
  /** Set error manually (for form validation, etc.) */
  setError: (error: string | null) => void;
}

/**
 * Hook for authentication state management
 * 
 * Uses Firebase Auth's built-in state management and adds app-specific features:
 * - Guest mode support
 * - Error handling
 * - Loading states
 * 
 * @example
 * ```typescript
 * const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
 * ```
 */
export function useAuth(): UseAuthResult {
  // Use Firebase Auth's built-in state management
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  
  // App-specific state
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const prevAuthState = useRef({ isAuthenticated: false, isGuest: false });

  // Sync Firebase Auth user with guest mode
  const user = isGuest ? null : firebaseUser;
  const isAuthenticated = !!user && !isGuest;

  // Handle analytics initialization (if callbacks are provided in config)
  useEffect(() => {
    const authChanged =
      prevAuthState.current.isAuthenticated !== isAuthenticated ||
      prevAuthState.current.isGuest !== isGuest;

    // Analytics initialization is handled by AuthService callbacks (onAnalyticsInit, onAnalyticsInitGuest)
    // This effect is kept for backward compatibility but analytics should be configured via AuthConfig

    // Update previous state
    prevAuthState.current = { isAuthenticated, isGuest };
  }, [isAuthenticated, isGuest]);

  // Reset guest mode when user signs in
  useEffect(() => {
    if (firebaseUser && isGuest) {
      setIsGuest(false);
    }
  }, [firebaseUser, isGuest]);

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
      // User state is updated by Firebase Auth's onAuthStateChanged
    } catch (err: any) {
      const errorMessage = err.message || "Sign up failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
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
      setLoading(true);
      setError(null);
      await service.signIn({ email, password });
      // User state is updated by Firebase Auth's onAuthStateChanged
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const service = getAuthService();
    if (!service) {
      return;
    }
    try {
      setLoading(true);
      await service.signOut();
      // User state is updated by Firebase Auth's onAuthStateChanged
    } finally {
      setLoading(false);
    }
  }, []);

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
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading: loading || firebaseLoading,
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
