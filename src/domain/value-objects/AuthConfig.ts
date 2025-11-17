/**
 * Auth Configuration Value Object
 * Validates and stores authentication configuration
 */

export interface AuthConfig {
  /** Minimum password length (default: 6) */
  minPasswordLength?: number;
  /** Require uppercase letters in password */
  requireUppercase?: boolean;
  /** Require lowercase letters in password */
  requireLowercase?: boolean;
  /** Require numbers in password */
  requireNumbers?: boolean;
  /** Require special characters in password */
  requireSpecialChars?: boolean;
}

export const DEFAULT_AUTH_CONFIG: Required<AuthConfig> = {
  minPasswordLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
};

