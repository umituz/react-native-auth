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

// Type declarations for expo-auth-session
interface GoogleAuthRequestConfig {
  iosClientId: string;
  webClientId: string;
  androidClientId: string;
}

interface AuthSessionAuthentication {
  idToken?: string;
  accessToken?: string;
}

interface AuthSessionResult {
  type: "success" | "cancel" | "dismiss" | "error" | "locked";
  authentication?: AuthSessionAuthentication;
}

interface AuthRequest {
  promptAsync: () => Promise<AuthSessionResult>;
}

type UseAuthRequestReturn = [
  AuthRequest | null,
  AuthSessionResult | null,
  () => Promise<AuthSessionResult>,
];

// Dynamic imports to handle optional dependencies
type GoogleModule = { useAuthRequest: (config: GoogleAuthRequestConfig) => UseAuthRequestReturn };
type WebBrowserModule = { maybeCompleteAuthSession: () => void };

let Google: GoogleModule | null = null;
let WebBrowser: WebBrowserModule | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  Google = require("expo-auth-session/providers/google") as GoogleModule;
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  WebBrowser = require("expo-web-browser") as WebBrowserModule;
  if (WebBrowser) {
    WebBrowser.maybeCompleteAuthSession();
  }
} catch {
  // expo-auth-session not available - silent fallback
}

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
    if (!Google || !promptGoogleAsync) {
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
