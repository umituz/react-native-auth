/**
 * useGoogleAuth Hook
 * Handles Google OAuth flow using expo-auth-session and Firebase auth
 *
 * This hook provides complete Google sign-in flow:
 * 1. OAuth flow via expo-auth-session
 * 2. Firebase authentication with the obtained token
 */

import { useState, useCallback, useEffect } from "react";
import {
  useSocialAuth,
  type SocialAuthConfig,
  type SocialAuthResult,
} from "@umituz/react-native-firebase";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export interface GoogleAuthConfig {
  iosClientId?: string;
  webClientId?: string;
  androidClientId?: string;
}

export interface UseGoogleAuthResult {
  signInWithGoogle: () => Promise<SocialAuthResult>;
  googleLoading: boolean;
  googleConfigured: boolean;
}

const PLACEHOLDER_CLIENT_ID = "000000000000-placeholder.apps.googleusercontent.com";

/**
 * Hook for Google authentication with expo-auth-session
 */
export function useGoogleAuth(config?: GoogleAuthConfig): UseGoogleAuthResult {
  const [isLoading, setIsLoading] = useState(false);

  const googleConfigured = !!(
    config?.iosClientId ||
    config?.webClientId ||
    config?.androidClientId
  );

  const socialAuthConfig: SocialAuthConfig = {
    google: config,
    apple: { enabled: false },
  };

  const { signInWithGoogleToken, googleLoading: firebaseLoading } =
    useSocialAuth(socialAuthConfig);

  // Use Google auth request if available
  const authRequest = Google?.useAuthRequest({
    iosClientId: config?.iosClientId || PLACEHOLDER_CLIENT_ID,
    webClientId: config?.webClientId || PLACEHOLDER_CLIENT_ID,
    androidClientId: config?.androidClientId || PLACEHOLDER_CLIENT_ID,
  });

  const request = authRequest?.[0] ?? null;
  const googleResponse = authRequest?.[1] ?? null;
  const promptGoogleAsync = authRequest?.[2];

  // Handle Google OAuth response
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const idToken = googleResponse.authentication?.idToken;
      if (idToken) {
        setIsLoading(true);
        signInWithGoogleToken(idToken)
          .catch(() => {
            // Silent error handling
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [googleResponse, signInWithGoogleToken]);

  const signInWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    if (!promptGoogleAsync) {
      return { success: false, error: "expo-auth-session is not available" };
    }

    if (!googleConfigured) {
      return { success: false, error: "Google Sign-In is not configured" };
    }

    if (!request) {
      return { success: false, error: "Google Sign-In not ready" };
    }

    setIsLoading(true);
    try {
      const result = await promptGoogleAsync();

      if (result.type === "success" && result.authentication?.idToken) {
        const firebaseResult = await signInWithGoogleToken(
          result.authentication.idToken,
        );
        return firebaseResult;
      }

      if (result.type === "cancel") {
        return { success: false, error: "Google Sign-In was cancelled" };
      }

      return { success: false, error: "Google Sign-In failed" };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Google sign-in failed",
      };
    } finally {
      setIsLoading(false);
    }
  }, [googleConfigured, request, promptGoogleAsync, signInWithGoogleToken]);

  return {
    signInWithGoogle,
    googleLoading: isLoading || firebaseLoading,
    googleConfigured,
  };
}
