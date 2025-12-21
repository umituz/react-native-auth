/**
 * useAuthState Hook
 * Single Responsibility: Manage authentication state
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { DeviceEventEmitter } from "react-native";
import { getAuthService } from "../../infrastructure/services/AuthService";
import { useFirebaseAuth } from "@umituz/react-native-firebase";
import { mapToAuthUser } from "../../infrastructure/utils/UserMapper";
import type { AuthUser } from "../../domain/entities/AuthUser";

export interface UseAuthStateResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  setIsGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Hook for managing authentication state
 */
export function useAuthState(): UseAuthStateResult {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
  const [isGuest, setIsGuest] = useState(() => {
    const service = getAuthService();
    return service ? service.getIsGuestMode() : false;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref to track latest isGuest value for event handlers
  const isGuestRef = useRef(isGuest);

  // Memoize user to prevent new object reference on every render
  const user = useMemo(() => {
    if (isGuest) return null;
    return mapToAuthUser(firebaseUser);
  }, [isGuest, firebaseUser?.uid]);

  // Anonymous users are NOT authenticated - they need to register/login
  const isAuthenticated = !!user && !isGuest && !user.isAnonymous;

  // Keep ref in sync with state
  useEffect(() => {
    isGuestRef.current = isGuest;
  }, [isGuest]);

  // Reset guest mode when user signs in
  useEffect(() => {
    if (firebaseUser && isGuest) {
      setIsGuest(false);
    }
  }, [firebaseUser, isGuest]);

  // Sync isGuest state with service on mount only
  useEffect(() => {
    const service = getAuthService();
    if (service) {
      const serviceIsGuest = service.getIsGuestMode();
      if (serviceIsGuest !== isGuestRef.current) {
        setIsGuest(serviceIsGuest);
      }
    }
  }, []);

  // Listen for auth events - subscribe once on mount
  useEffect(() => {
    const guestSubscription = DeviceEventEmitter.addListener(
      "guest-mode-enabled",
      () => setIsGuest(true)
    );

    const authSubscription = DeviceEventEmitter.addListener(
      "user-authenticated",
      () => {
        if (isGuestRef.current) {
          setIsGuest(false);
        }
      }
    );

    const errorSubscription = DeviceEventEmitter.addListener(
      "auth-error",
      (payload: any) => {
        if (payload?.error) {
          setError(payload.error);
        }
      }
    );

    return () => {
      guestSubscription.remove();
      authSubscription.remove();
      errorSubscription.remove();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isGuest,
    loading: loading || firebaseLoading,
    error,
    setError,
    setIsGuest,
    setLoading,
  };
}

