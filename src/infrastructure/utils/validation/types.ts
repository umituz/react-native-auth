/**
 * Validation Types
 * Shared type definitions for validation results across the application
 */

/**
 * Base validation result
 * Common interface for all validation results
 */
export interface BaseValidationResult {
  isValid: boolean;
}

/**
 * Single field validation result
 * Used for validating individual fields (email, password, etc.)
 */
export interface ValidationResult extends BaseValidationResult {
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
export interface FormValidationResult extends BaseValidationResult {
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
export interface PasswordStrengthResult extends ValidationResult {
  requirements: PasswordRequirements;
}
