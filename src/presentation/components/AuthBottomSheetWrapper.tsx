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

import React from "react";
import { AuthBottomSheet } from "./AuthBottomSheet";
import { useAuthBottomSheetWrapper, type SocialAuthConfiguration } from "../hooks/useAuthBottomSheetWrapper";

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
  const { providers, handleGoogleSignIn, handleAppleSignIn } = useAuthBottomSheetWrapper({
    socialConfig,
  });

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
