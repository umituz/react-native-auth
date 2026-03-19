/**
 * Form Validation Types
 * Infrastructure-specific form validation types
 */

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

