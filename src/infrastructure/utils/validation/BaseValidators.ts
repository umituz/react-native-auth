import { ValidationResult } from './types';

/**
 * Validate required field (not null, undefined, or empty string)
 */
export const validateRequired = (
  value: any,
  fieldName: string = "Field",
  errorKey?: string
): ValidationResult => {
  const isValid = value !== undefined && value !== null && (typeof value === 'string' ? value.trim() !== "" : true);
  
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `${fieldName} is required`)
  };
};

/**
 * Validate pattern (regex)
 */
export const validatePattern = (
  value: string,
  pattern: RegExp,
  fieldName: string = "Field",
  errorKey?: string
): ValidationResult => {
  if (!value) return { isValid: true }; // Use validateRequired for mandatory check

  const isValid = pattern.test(value);
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `${fieldName} format is invalid`)
  };
};
