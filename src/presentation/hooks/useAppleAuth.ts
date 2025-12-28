/**
 * useAppleAuth Hook
 * Handles Apple Sign-In using Firebase auth
 *
 * This is a convenience wrapper around useSocialAuth from Firebase package
 * specifically for Apple authentication.
 */

import { useCallback } from "react";
import { Platform } from "react-native";
import {
  useSocialAuth,
  type SocialAuthResult,
} from "@umituz/react-native-firebase";

declare const __DEV__: boolean;

export interface UseAppleAuthResult {
  signInWithApple: () => Promise<SocialAuthResult>;
  appleLoading: boolean;
  appleAvailable: boolean;
}

/**
 * Hook for Apple authentication
 */
export function useAppleAuth(): UseAppleAuthResult {
  const { signInWithApple, appleLoading, appleAvailable } = useSocialAuth({
    apple: { enabled: Platform.OS === "ios" },
  });

  const handleSignInWithApple = useCallback(async (): Promise<SocialAuthResult> => {
    if (Platform.OS !== "ios") {
      return { success: false, error: "Apple Sign-In is only available on iOS" };
    }

    if (!appleAvailable) {
      return { success: false, error: "Apple Sign-In is not available" };
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAppleAuth] Apple sign-in requested");
    }

    const result = await signInWithApple();

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAppleAuth] Apple sign-in result:", result);
    }

    return result;
  }, [appleAvailable, signInWithApple]);

  return {
    signInWithApple: handleSignInWithApple,
    appleLoading,
    appleAvailable,
  };
}
