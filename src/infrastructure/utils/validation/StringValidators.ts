import { ValidationResult } from './types';

/**
 * Validate min length of a string
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = "Field",
  errorKey?: string
): ValidationResult => {
  if (!value) return { isValid: false, error: `${fieldName} is required` };
  
  const isValid = value.trim().length >= minLength;
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `${fieldName} must be at least ${minLength} characters`)
  };
};

/**
 * Validate max length of a string
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = "Field",
  errorKey?: string
): ValidationResult => {
  if (!value) return { isValid: true };
  
  const isValid = value.trim().length <= maxLength;
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `${fieldName} must be at most ${maxLength} characters`)
  };
};

/**
 * Validate phone number (E.164 format)
 */
export const validatePhone = (
  phone: string,
  errorKey?: string
): ValidationResult => {
  if (!phone) return { isValid: true };
  
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  const isValid = phoneRegex.test(phone);
  
  return {
    isValid,
    error: isValid ? undefined : (errorKey || "Please enter a valid phone number")
  };
};
