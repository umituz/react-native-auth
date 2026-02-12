/**
 * Form Validation Utilities
 * Helper functions for form validation
 */

import type { FormValidationError } from "./formValidation.types";

/**
 * Convert validation errors array to field errors object
 */
export function errorsToFieldErrors(errors: FormValidationError[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const error of errors) {
    result[error.field] = error.message;
  }
  return result;
}
