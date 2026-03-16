/**
 * Form Error Collection Utility
 * Pure utility functions for collecting and extracting form errors
 * Separates error collection logic from hooks for better testability
 */

import type { FormValidationError } from "../../../presentation/utils/form/validation/formValidation.types";

/**
 * Collect field errors from validation result
 * Extracts error messages for specific fields
 */
export function collectFieldErrors(
  errors: FormValidationError[],
  fields: string[]
): Record<string, string | null> {
  const result: Record<string, string | null> = {};

  for (const field of fields) {
    const fieldError = errors.find((e) => e.field === field);
    result[field] = fieldError?.message ?? null;
  }

  return result;
}

/**
 * Extract single field error from validation result
 */
export function extractFieldError(
  errors: FormValidationError[],
  field: string
): string | null {
  const fieldError = errors.find((e) => e.field === field);
  return fieldError?.message ?? null;
}

/**
 * Check if validation has errors for specific fields
 */
export function hasFieldErrors(
  errors: FormValidationError[],
  fields: string[]
): boolean {
  return errors.some((error) => fields.includes(error.field));
}

/**
 * Get first error message from validation result
 */
export function getFirstErrorMessage(errors: FormValidationError[]): string | null {
  if (errors.length === 0) {
    return null;
  }
  return errors[0].message ?? null;
}
