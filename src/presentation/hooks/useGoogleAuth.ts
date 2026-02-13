/**
 * useGoogleAuth Hook
 * Handles Google Sign-In using Firebase auth
 *
 * This is a re-export wrapper around useGoogleOAuth from Firebase package
 * for consistency with the auth package API.
 */

import { useGoogleOAuth } from "@umituz/react-native-firebase";

// Re-export types from firebase
export type {
  GoogleOAuthConfig as GoogleAuthConfig,
  UseGoogleOAuthResult as UseGoogleAuthResult,
  SocialAuthResult,
} from "@umituz/react-native-firebase";

/**
 * Hook for Google authentication
 * This is a direct re-export of useGoogleOAuth from firebase package
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const useGoogleAuth = useGoogleOAuth;

