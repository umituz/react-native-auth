/**
 * Field Utilities
 * Utility functions for individual field operations
 */

/**
 * Create field change handler with callback
 */
export function createFieldChangeHandler(
  onChange: (value: string) => void,
  callbacks?: {
    onErrorClear?: () => void;
    onValidationError?: () => void;
  }
) {
  return (value: string) => {
    onChange(value);
    callbacks?.onErrorClear?.();
  };
}

/**
 * Create field blur handler
 */
export function createFieldBlurHandler(
  onBlur: () => void,
  validate?: () => void
) {
  return () => {
    onBlur();
    validate?.();
  };
}

/**
 * Debounce field change
 */
export function debounceFieldChange(
  onChange: (value: string) => void,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (value: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      onChange(value);
    }, delay);
  };
}

/**
 * Check if field value is empty
 */
export function isFieldValueEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Sanitize field value
 */
export function sanitizeFieldValue(
  value: string,
  sanitizers: Array<(value: string) => string>
): string {
  return sanitizers.reduce((acc, sanitizer) => sanitizer(acc), value);
}

/**
 * Format field value for display
 */
export function formatFieldValue(
  value: string,
  formatter: (value: string) => string
): string {
  return formatter(value);
}

/**
 * Validate field value
 */
export function validateFieldValue(
  value: string,
  validators: Array<(value: string) => boolean>
): boolean {
  return validators.every((validator) => validator(value));
}

/**
 * Get field display value
 */
export function getFieldDisplayValue(
  value: string,
  placeholder: string = ''
): string {
  return value || placeholder;
}

/**
 * Truncate field value
 */
export function truncateFieldValue(
  value: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return value.substring(0, maxLength - suffix.length) + suffix;
}
