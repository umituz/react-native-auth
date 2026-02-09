/**
 * useGoogleAuth Hook
 * Handles Google OAuth flow using expo-auth-session and Firebase auth
 */

import { useState, useCallback, useEffect } from "react";
import { useSocialAuth, type SocialAuthConfig, type SocialAuthResult } from "@umituz/react-native-firebase";
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
  googleError: string | null;
}

const PLACEHOLDER_CLIENT_ID = "000000000000-placeholder.apps.googleusercontent.com";

function validateGoogleConfig(config?: GoogleAuthConfig): boolean {
  if (!config) return false;
  return !!(
    (config.iosClientId && config.iosClientId !== PLACEHOLDER_CLIENT_ID) ||
    (config.webClientId && config.webClientId !== PLACEHOLDER_CLIENT_ID) ||
    (config.androidClientId && config.androidClientId !== PLACEHOLDER_CLIENT_ID)
  );
}

export function useGoogleAuth(config?: GoogleAuthConfig): UseGoogleAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const googleConfigured = validateGoogleConfig(config);

  const { signInWithGoogleToken, googleLoading: firebaseLoading } = useSocialAuth({
    google: config,
    apple: { enabled: false },
  } as SocialAuthConfig);

  const authRequest = Google?.useAuthRequest({
    iosClientId: config?.iosClientId || PLACEHOLDER_CLIENT_ID,
    webClientId: config?.webClientId || PLACEHOLDER_CLIENT_ID,
    androidClientId: config?.androidClientId || PLACEHOLDER_CLIENT_ID,
  });

  const request = authRequest?.[0] ?? null;
  const googleResponse = authRequest?.[1] ?? null;
  const promptGoogleAsync = authRequest?.[2];

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const idToken = googleResponse.authentication?.idToken;
      if (idToken) {
        setIsLoading(true);
        setGoogleError(null);
        signInWithGoogleToken(idToken)
          .catch((error) => { setGoogleError(error instanceof Error ? error.message : "Firebase sign-in failed"); })
          .finally(() => { setIsLoading(false); });
      }
    } else if (googleResponse?.type === "error") {
      setGoogleError("Google authentication failed");
      setIsLoading(false);
    }
  }, [googleResponse, signInWithGoogleToken]);

  const signInWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    if (!promptGoogleAsync) {
      const error = "expo-auth-session is not available";
      setGoogleError(error);
      return { success: false, error };
    }

    if (!googleConfigured) {
      const error = "Google Sign-In is not configured. Please provide valid client IDs.";
      setGoogleError(error);
      return { success: false, error };
    }

    if (!request) {
      const error = "Google Sign-In not ready";
      setGoogleError(error);
      return { success: false, error };
    }

    setIsLoading(true);
    setGoogleError(null);
    try {
      const result = await promptGoogleAsync();

      if (result.type === "success" && result.authentication?.idToken) {
        return await signInWithGoogleToken(result.authentication.idToken);
      }

      if (result.type === "cancel") {
        const error = "Google Sign-In was cancelled";
        setGoogleError(error);
        return { success: false, error };
      }

      const error = "Google Sign-In failed";
      setGoogleError(error);
      return { success: false, error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed";
      setGoogleError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [googleConfigured, request, promptGoogleAsync, signInWithGoogleToken]);

  return {
    signInWithGoogle,
    googleLoading: isLoading || firebaseLoading,
    googleConfigured,
    googleError,
  };
}
