/**
 * useGoogleAuth Hook
 * Handles Google Sign-In using Firebase auth
 */

import { useGoogleOAuth } from "@umituz/react-native-firebase";

export type {
  GoogleOAuthConfig as GoogleAuthConfig,
  UseGoogleOAuthResult as UseGoogleAuthResult,
  SocialAuthResult,
} from "@umituz/react-native-firebase";

/**
 * Hook for Google authentication
 */
export const useGoogleAuth = useGoogleOAuth;

