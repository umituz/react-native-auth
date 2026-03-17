/**
 * Validation Types
 * Shared type definitions for validation results across the application
 */

/**
 * Single field validation result
 * Used for validating individual fields (email, password, etc.)
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Form validation error
 * Represents an error for a specific form field
 */
export interface FormValidationError {
  field: string;
  message: string;
}

/**
 * Multi-field form validation result
 * Used for validating entire forms with multiple fields
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

/**
 * Password requirements
 * Tracks which password requirements are met
 */
export interface PasswordRequirements {
  hasMinLength: boolean;
}

/**
 * Password strength validation result
 * Extends ValidationResult with password-specific requirements
 */
export interface PasswordStrengthResult {
  isValid: boolean;
  error?: string;
  requirements: PasswordRequirements;
}
