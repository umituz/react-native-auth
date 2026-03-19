/**
 * Validation Types
 * Core types for validation system
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordRequirements {
  hasMinLength: boolean;
}

export interface PasswordStrengthResult extends ValidationResult {
  requirements?: PasswordRequirements;
}

export interface ValidationRule<T = unknown> {
  validate(value: T): ValidationResult;
}

export interface ValidatorConfig {
  emailRegex?: RegExp;
  displayNameMinLength?: number;
}
