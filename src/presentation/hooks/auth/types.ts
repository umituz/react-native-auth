/**
 * Auth Bottom Sheet Types
 */

import type { GoogleAuthConfig } from '../useGoogleAuth';
import type { SocialAuthProvider } from '../../domain/value-objects/AuthConfig';

export interface SocialAuthConfiguration {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}

export interface UseAuthBottomSheetParams {
  socialConfig?: SocialAuthConfiguration;
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
  /** Called when auth completes successfully (login or register) */
  onAuthSuccess?: () => void;
}

export interface SocialAuthHandlers {
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  googleLoading: boolean;
  appleLoading: boolean;
}
