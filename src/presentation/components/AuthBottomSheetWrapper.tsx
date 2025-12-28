/**
 * AuthBottomSheetWrapper Component
 * Self-contained auth modal with integrated social login
 *
 * This wrapper component combines AuthBottomSheet with social auth hooks,
 * providing a complete authentication solution for apps.
 *
 * Usage:
 * ```tsx
 * <AuthBottomSheetWrapper
 *   termsUrl="https://myapp.com/terms"
 *   privacyUrl="https://myapp.com/privacy"
 *   socialConfig={{
 *     google: { webClientId: '...', iosClientId: '...' },
 *     apple: { enabled: true }
 *   }}
 * />
 * ```
 */

import React, { useCallback, useMemo } from "react";
import { Platform } from "react-native";
import { AuthBottomSheet } from "./AuthBottomSheet";
import { useGoogleAuth, type GoogleAuthConfig } from "../hooks/useGoogleAuth";
import { useAppleAuth } from "../hooks/useAppleAuth";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

declare const __DEV__: boolean;

export interface SocialAuthConfiguration {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}

export interface AuthBottomSheetWrapperProps {
  /** Terms of Service URL */
  termsUrl?: string;
  /** Privacy Policy URL */
  privacyUrl?: string;
  /** Called when Terms link is pressed (overrides default behavior) */
  onTermsPress?: () => void;
  /** Called when Privacy link is pressed (overrides default behavior) */
  onPrivacyPress?: () => void;
  /** Social auth configuration */
  socialConfig?: SocialAuthConfiguration;
}

/**
 * Self-contained auth bottom sheet with integrated social login
 */
export const AuthBottomSheetWrapper: React.FC<AuthBottomSheetWrapperProps> = ({
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
  socialConfig,
}) => {
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
      console.log("[AuthBottomSheetWrapper] Enabled providers:", result);
    }

    return result;
  }, [socialConfig?.apple?.enabled, appleAvailable, googleConfigured]);

  const handleGoogleSignIn = useCallback(async () => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[AuthBottomSheetWrapper] Google sign-in requested");
    }
    const result = await signInWithGoogle();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[AuthBottomSheetWrapper] Google result:", result);
    }
  }, [signInWithGoogle]);

  const handleAppleSignIn = useCallback(async () => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[AuthBottomSheetWrapper] Apple sign-in requested");
    }
    const result = await signInWithApple();
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("[AuthBottomSheetWrapper] Apple result:", result);
    }
  }, [signInWithApple]);

  return (
    <AuthBottomSheet
      termsUrl={termsUrl}
      privacyUrl={privacyUrl}
      onTermsPress={onTermsPress}
      onPrivacyPress={onPrivacyPress}
      socialProviders={providers}
      onGoogleSignIn={handleGoogleSignIn}
      onAppleSignIn={handleAppleSignIn}
    />
  );
};
