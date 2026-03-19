/**
 * Form Utilities
 * Utility functions for common form operations
 */

/**
 * Sanitize form values
 */
export function sanitizeFormValues<T extends Record<string, string>>(
  values: T,
  sanitizers: Partial<Record<keyof T, (value: string) => string>>
): T {
  const sanitized = { ...values };

  for (const key in sanitizers) {
    if (key in sanitized) {
      const sanitizer = sanitizers[key];
      if (sanitizer) {
        sanitized[key] = sanitizer(sanitized[key]) as T[Extract<keyof T, string>];
      }
    }
  }

  return sanitized;
}

/**
 * Extract form values for specific fields
 */
export function extractFields<T extends Record<string, string>>(
  values: T,
  fields: (keyof T)[]
): Pick<T, keyof T> {
  const extracted = {} as Pick<T, keyof T>;

  for (const field of fields) {
    if (field in values) {
      extracted[field] = values[field];
    }
  }

  return extracted;
}

/**
 * Check if all required fields are filled
 */
export function areRequiredFieldsFilled<T extends Record<string, string>>(
  values: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => {
    const value = values[field];
    return value && value.trim().length > 0;
  });
}

/**
 * Get empty required fields
 */
export function getEmptyRequiredFields<T extends Record<string, string>>(
  values: T,
  requiredFields: (keyof T)[]
): (keyof T)[] {
  return requiredFields.filter((field) => {
    const value = values[field];
    return !value || value.trim().length === 0;
  });
}

/**
 * Create form field options
 */
export function createFieldOptions<T extends Record<string, string>>(
  fields: Record<keyof T, { validateOnChange?: boolean; clearErrorOnChange?: boolean }>
) {
  return fields;
}

/**
 * Merge form errors
 */
export function mergeFormErrors<T extends Record<string, string>>(
  ...errorObjects: Array<Partial<Record<keyof T, string | null>>>
): Record<keyof T, string | null> {
  const merged = {} as Record<keyof T, string | null>;

  for (const errors of errorObjects) {
    for (const key in errors) {
      if (errors[key as keyof T] !== undefined) {
        merged[key as keyof T] = errors[key as keyof T] as string | null;
      }
    }
  }

  return merged;
}

/**
 * Clear specific field errors
 */
export function clearFieldErrors<T extends Record<string, string>>(
  errors: Record<keyof T, string | null>,
  fields: (keyof T)[]
): Record<keyof T, string | null> {
  const cleared = { ...errors };

  for (const field of fields) {
    cleared[field] = null;
  }

  return cleared;
}
