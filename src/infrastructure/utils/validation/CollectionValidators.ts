import { ValidationResult } from './types';

/**
 * Custom enum validation
 * Generic validator for enum-like values with custom options
 */
export const validateEnum = (
  value: string,
  validOptions: readonly string[],
  fieldName: string = "Field",
  errorKey?: string
): ValidationResult => {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const isValid = validOptions.includes(value.toLowerCase());
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `Please select a valid ${fieldName.toLowerCase()}`)
  };
};

/**
 * Tags validation
 * Generic validator for array of strings with constraints
 */
export const validateTags = (
  tags: string[],
  maxTags: number = 10,
  maxTagLength: number = 20,
  errorKey?: string
): ValidationResult => {
  if (!Array.isArray(tags)) {
    return { isValid: false, error: errorKey || "Tags must be an array" };
  }

  if (tags.length > maxTags) {
    return { isValid: false, error: errorKey || `Maximum ${maxTags} tags allowed` };
  }

  for (const tag of tags) {
    if (typeof tag !== "string" || tag.trim().length === 0) {
      return { isValid: false, error: errorKey || "All tags must be non-empty strings" };
    }

    if (tag.trim().length > maxTagLength) {
      return {
        isValid: false,
        error: errorKey || `Each tag must be at most ${maxTagLength} characters`,
      };
    }
  }

  return { isValid: true };
};
