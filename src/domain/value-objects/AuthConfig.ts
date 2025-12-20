/**
 * Auth Configuration Value Object
 * Validates and stores authentication configuration
 */

export interface PasswordConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

/**
 * Social authentication provider configuration
 */
export interface SocialProviderConfig {
  enabled: boolean;
}

export interface GoogleAuthConfig extends SocialProviderConfig {
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
}

export interface AppleAuthConfig extends SocialProviderConfig {
  // Apple Sign In doesn't require additional config for basic usage
}

/**
 * Social authentication configuration
 */
export interface SocialAuthConfig {
  google?: GoogleAuthConfig;
  apple?: AppleAuthConfig;
}

/**
 * Supported social auth providers
 */
export type SocialAuthProvider = "google" | "apple";

export interface AuthConfig {
  password: PasswordConfig;
  social?: SocialAuthConfig;
}

export const DEFAULT_PASSWORD_CONFIG: PasswordConfig = {
  minLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumber: false,
  requireSpecialChar: false,
};

export const DEFAULT_SOCIAL_CONFIG: SocialAuthConfig = {
  google: { enabled: false },
  apple: { enabled: false },
};

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  password: DEFAULT_PASSWORD_CONFIG,
  social: DEFAULT_SOCIAL_CONFIG,
};

