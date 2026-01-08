/**
 * Validation Result Interface
 * Represents the outcome of a validation operation
 */
export interface ValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;

  /**
   * Error message or translation key if validation failed
   */
  error?: string;
}
