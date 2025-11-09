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
  /** Callback for user profile creation after signup */
  onUserCreated?: (user: any) => Promise<void> | void;
  /** Callback for user profile update */
  onUserUpdated?: (user: any) => Promise<void> | void;
  /** Callback for sign out cleanup */
  onSignOut?: () => Promise<void> | void;
}

export const DEFAULT_AUTH_CONFIG: Required<Omit<AuthConfig, 'onUserCreated' | 'onUserUpdated' | 'onSignOut'>> = {
  minPasswordLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
};

