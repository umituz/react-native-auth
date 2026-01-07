import { useCallback, useMemo } from "react";
import { Platform } from "react-native";
import { useGoogleAuth, type GoogleAuthConfig } from "./useGoogleAuth";
import { useAppleAuth } from "./useAppleAuth";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

declare const __DEV__: boolean;

export interface SocialAuthConfiguration {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}

interface UseAuthBottomSheetWrapperProps {
  socialConfig?: SocialAuthConfiguration;
}

export function useAuthBottomSheetWrapper({ socialConfig }: UseAuthBottomSheetWrapperProps) {
  const { signInWithGoogle, googleConfigured } = useGoogleAuth(socialConfig?.google);
  const { signInWithApple, appleAvailable } = useAppleAuth();

  const providers = useMemo<SocialAuthProvider[]>(() => {
    const result: SocialAuthProvider[] = [];

    if (Platform.OS === "ios" && socialConfig?.apple?.enabled && appleAvailable) {
      result.push("apple");
    }

    if (googleConfigured) {
      result.push("google");
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAuthBottomSheetWrapper] Enabled providers:", result);
    }

    return result;
  }, [socialConfig?.apple?.enabled, appleAvailable, googleConfigured]);

  const handleGoogleSignIn = useCallback(async () => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAuthBottomSheetWrapper] Google sign-in requested");
    }
    const result = await signInWithGoogle();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAuthBottomSheetWrapper] Google result:", result);
    }
  }, [signInWithGoogle]);

  const handleAppleSignIn = useCallback(async () => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAuthBottomSheetWrapper] Apple sign-in requested");
    }
    const result = await signInWithApple();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[useAuthBottomSheetWrapper] Apple result:", result);
    }
  }, [signInWithApple]);

  return {
    providers,
    handleGoogleSignIn,
    handleAppleSignIn,
  };
}
