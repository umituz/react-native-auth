/**
 * Auth Configuration Value Object
 * Validates and stores authentication configuration
 */

export interface PasswordConfig {
  minLength: number;
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
};

export const DEFAULT_SOCIAL_CONFIG: SocialAuthConfig = {
  google: { enabled: false },
  apple: { enabled: false },
};

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  password: DEFAULT_PASSWORD_CONFIG,
  social: DEFAULT_SOCIAL_CONFIG,
};

/**
 * Configuration validation error
 */
export class AuthConfigValidationError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
    this.name = "AuthConfigValidationError";
  }
}

/**
 * Validate authentication configuration
 * @throws {AuthConfigValidationError} if configuration is invalid
 */
export function validateAuthConfig(config: Partial<AuthConfig>): void {
  // Validate password config
  if (config.password) {
    if (typeof config.password.minLength !== "number") {
      throw new AuthConfigValidationError(
        "Password minLength must be a number",
        "password.minLength"
      );
    }
    if (config.password.minLength < 4) {
      throw new AuthConfigValidationError(
        "Password minLength must be at least 4 characters",
        "password.minLength"
      );
    }
    if (config.password.minLength > 128) {
      throw new AuthConfigValidationError(
        "Password minLength must not exceed 128 characters",
        "password.minLength"
      );
    }
  }

  // Validate social auth config
  if (config.social) {
    if (config.social.google) {
      const googleConfig = config.social.google;
      if (googleConfig.enabled) {
        // At least one client ID should be provided if enabled
        if (!googleConfig.webClientId && !googleConfig.iosClientId && !googleConfig.androidClientId) {
          throw new AuthConfigValidationError(
            "At least one Google client ID (web, iOS, or Android) must be provided when Google Sign-In is enabled",
            "social.google"
          );
        }
      }
    }
  }
}

/**
 * Sanitize and merge auth config with defaults
 * Ensures valid configuration values
 */
export function sanitizeAuthConfig(config: Partial<AuthConfig> = {}): AuthConfig {
  // Validate first
  validateAuthConfig(config);

  return {
    password: {
      minLength: config.password?.minLength ?? DEFAULT_PASSWORD_CONFIG.minLength,
    },
    social: {
      google: {
        enabled: config.social?.google?.enabled ?? DEFAULT_SOCIAL_CONFIG.google?.enabled ?? false,
        webClientId: config.social?.google?.webClientId,
        iosClientId: config.social?.google?.iosClientId,
        androidClientId: config.social?.google?.androidClientId,
      },
      apple: {
        enabled: config.social?.apple?.enabled ?? DEFAULT_SOCIAL_CONFIG.apple?.enabled ?? false,
      },
    },
  };
}

