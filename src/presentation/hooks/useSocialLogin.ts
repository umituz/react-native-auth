/**
 * useSocialLogin Hook
 * Provides unified social login functionality using Firebase package
 *
 * This hook wraps @umituz/react-native-firebase's useSocialAuth
 * and provides a simple interface for social authentication.
 *
 * Usage:
 * ```typescript
 * const { signInWithGoogle, signInWithApple, googleLoading, appleLoading } = useSocialLogin({
 *   google: { webClientId: '...', iosClientId: '...' },
 *   apple: { enabled: true }
 * });
 * ```
 */

import { useCallback } from "react";
import { Platform } from "react-native";
import {
  useSocialAuth,
  type SocialAuthConfig,
  type SocialAuthResult,
} from "@umituz/react-native-firebase";

export interface UseSocialLoginConfig extends SocialAuthConfig {}

export interface UseSocialLoginResult {
  /** Sign in with Google (handles OAuth flow internally if configured) */
  signInWithGoogle: () => Promise<SocialAuthResult>;
  /** Sign in with Apple */
  signInWithApple: () => Promise<SocialAuthResult>;
  /** Whether Google sign-in is in progress */
  googleLoading: boolean;
  /** Whether Apple sign-in is in progress */
  appleLoading: boolean;
  /** Whether Google is configured */
  googleConfigured: boolean;
  /** Whether Apple is available */
  appleAvailable: boolean;
}

/**
 * Hook for social authentication
 * Integrates with @umituz/react-native-firebase for Firebase auth
 */
export function useSocialLogin(config?: UseSocialLoginConfig): UseSocialLoginResult {
  const {
    signInWithApple: firebaseSignInWithApple,
    googleLoading,
    appleLoading,
    googleConfigured,
    appleAvailable,
  } = useSocialAuth(config);

  /**
   * Sign in with Google
   * Note: For full OAuth flow, use useGoogleAuth hook which handles
   * expo-auth-session OAuth flow and Firebase authentication
   */
  const signInWithGoogle = useCallback((): Promise<SocialAuthResult> => {
    if (!googleConfigured) {
      return Promise.resolve({ success: false, error: "Google Sign-In is not configured" });
    }

    return Promise.resolve({
      success: false,
      error: "Use useGoogleAuth hook for Google OAuth flow",
    });
  }, [googleConfigured]);

  /**
   * Sign in with Apple (full flow handled by Firebase package)
   */
  const signInWithApple = useCallback(async (): Promise<SocialAuthResult> => {
    if (Platform.OS !== "ios") {
      return { success: false, error: "Apple Sign-In is only available on iOS" };
    }

    if (!appleAvailable) {
      return { success: false, error: "Apple Sign-In is not available" };
    }

    return firebaseSignInWithApple();
  }, [appleAvailable, firebaseSignInWithApple]);

  return {
    signInWithGoogle,
    signInWithApple,
    googleLoading,
    appleLoading,
    googleConfigured,
    appleAvailable,
  };
}

export { type SocialAuthConfig, type SocialAuthResult };
