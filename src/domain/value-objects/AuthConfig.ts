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

export interface AuthConfig {
  password: PasswordConfig;
}

export const DEFAULT_PASSWORD_CONFIG: PasswordConfig = {
  minLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumber: false,
  requireSpecialChar: false,
};

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  password: DEFAULT_PASSWORD_CONFIG,
};

