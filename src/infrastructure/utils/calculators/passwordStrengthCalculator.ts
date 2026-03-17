/**
 * Password Strength Calculator Utility
 * Pure utility functions for password validation and strength calculation
 * Separates password logic from hooks for better testability
 */

import {
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../AuthValidation";
import type { PasswordConfig } from "../../../domain/value-objects/AuthConfig";
import type { PasswordRequirements } from "../validation/types";

interface PasswordValidationInput {
  password: string;
  confirmPassword: string;
  config?: PasswordConfig;
}

interface PasswordValidationResult {
  requirements: PasswordRequirements;
  passwordsMatch: boolean;
  isValid: boolean;
  confirmationError: string | null;
}

/**
 * Calculate password requirements from validation result
 */
export function calculatePasswordRequirements(
  password: string,
  config?: PasswordConfig
): PasswordRequirements {
  if (!password || !config) {
    return { hasMinLength: false };
  }

  const result = validatePasswordForRegister(password, config);
  return result.requirements;
}

/**
 * Calculate if passwords match
 * Explicitly converts to boolean to avoid type issues
 */
export function calculatePasswordsMatch(
  password: string,
  confirmPassword: string
): boolean {
  return !!(password && confirmPassword && password === confirmPassword);
}

/**
 * Calculate all password validation state at once
 * More efficient than calling individual functions
 */
export function calculatePasswordValidation(
  input: PasswordValidationInput
): PasswordValidationResult {
  const { password, confirmPassword, config } = input;

  // Calculate password requirements
  const requirements = calculatePasswordRequirements(password, config);

  // Calculate if passwords match
  const passwordsMatch = calculatePasswordsMatch(password, confirmPassword);

  // Calculate confirmation error
  let confirmationError: string | null = null;
  if (confirmPassword) {
    const result = validatePasswordConfirmation(password, confirmPassword);
    confirmationError = result.error ?? null;
  }

  // Calculate overall validity
  const isValid = requirements.hasMinLength && passwordsMatch;

  return {
    requirements,
    passwordsMatch,
    isValid,
    confirmationError,
  };
}

/**
 * Calculate password strength score (0-100)
 * Can be extended for more sophisticated strength calculation
 */
export function calculatePasswordStrength(
  password: string,
  requirements: PasswordRequirements
): number {
  if (!password) return 0;

  let score = 0;

  // Base score for meeting minimum length
  if (requirements.hasMinLength) {
    score += 40;
  }

  // Additional points for length
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;

  // Additional points for variety (can be extended)
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  score += varietyCount * 5;

  return Math.min(score, 100);
}
