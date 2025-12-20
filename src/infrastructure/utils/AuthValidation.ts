/**
 * Auth Validation Utilities
 * Single Responsibility: Email and password validation for authentication
 */

import type { PasswordConfig } from "../../domain/value-objects/AuthConfig";
import { getAuthPackage } from "../services/AuthPackage";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordStrengthResult extends ValidationResult {
  requirements: PasswordRequirements;
}

export interface PasswordRequirements {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface ValidationConfig {
  emailRegex: RegExp;
  uppercaseRegex: RegExp;
  lowercaseRegex: RegExp;
  numberRegex: RegExp;
  specialCharRegex: RegExp;
  displayNameMinLength: number;
}

const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uppercaseRegex: /[A-Z]/,
  lowercaseRegex: /[a-z]/,
  numberRegex: /[0-9]/,
  specialCharRegex: /[!@#$%^&*(),.?":{}|<>]/,
  displayNameMinLength: 2,
};

function getValidationConfig(): ValidationConfig {
  const packageConfig = getAuthPackage()?.getConfig();
  return {
    emailRegex: packageConfig?.validation.emailRegex || DEFAULT_VALIDATION_CONFIG.emailRegex,
    uppercaseRegex: DEFAULT_VALIDATION_CONFIG.uppercaseRegex,
    lowercaseRegex: DEFAULT_VALIDATION_CONFIG.lowercaseRegex,
    numberRegex: DEFAULT_VALIDATION_CONFIG.numberRegex,
    specialCharRegex: DEFAULT_VALIDATION_CONFIG.specialCharRegex,
    displayNameMinLength: DEFAULT_VALIDATION_CONFIG.displayNameMinLength,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  const config = getValidationConfig();
  if (!config.emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
}

/**
 * Validate password for login - only checks if password is provided
 * No strength requirements for login (existing users may have old passwords)
 */
export function validatePasswordForLogin(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { isValid: false, error: "Password is required" };
  }

  return { isValid: true };
}

/**
 * Validate password strength for registration
 * Returns detailed requirements for UI feedback
 */
export function validatePasswordForRegister(
  password: string,
  config: PasswordConfig
): PasswordStrengthResult {
  const validationConfig = getValidationConfig();
  const requirements: PasswordRequirements = {
    hasMinLength: password.length >= config.minLength,
    hasUppercase: !config.requireUppercase || validationConfig.uppercaseRegex.test(password),
    hasLowercase: !config.requireLowercase || validationConfig.lowercaseRegex.test(password),
    hasNumber: !config.requireNumber || validationConfig.numberRegex.test(password),
    hasSpecialChar:
      !config.requireSpecialChar || validationConfig.specialCharRegex.test(password),
  };

  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: "Password is required",
      requirements,
    };
  }

  if (!requirements.hasMinLength) {
    return {
      isValid: false,
      error: `Password must be at least ${config.minLength} characters`,
      requirements,
    };
  }

  if (config.requireUppercase && !validationConfig.uppercaseRegex.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
      requirements,
    };
  }

  if (config.requireLowercase && !validationConfig.lowercaseRegex.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
      requirements,
    };
  }

  if (config.requireNumber && !validationConfig.numberRegex.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
      requirements,
    };
  }

  if (config.requireSpecialChar && !validationConfig.specialCharRegex.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
      requirements,
    };
  }

  return { isValid: true, requirements };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
}

/**
 * Validate display name
 */
export function validateDisplayName(
  displayName: string,
  minLength?: number
): ValidationResult {
  if (!displayName || displayName.trim() === "") {
    return { isValid: false, error: "Name is required" };
  }

  const config = getValidationConfig();
  const actualMinLength = minLength ?? config.displayNameMinLength;

  if (displayName.trim().length < actualMinLength) {
    return {
      isValid: false,
      error: `Name must be at least ${actualMinLength} characters`,
    };
  }

  return { isValid: true };
}

