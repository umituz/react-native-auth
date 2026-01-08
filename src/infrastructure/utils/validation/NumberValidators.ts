import { ValidationResult } from './types';

/**
 * Validate numeric range
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string = "Number",
  errorKey?: string
): ValidationResult => {
  const isValid = value >= min && value <= max;
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `${fieldName} must be between ${min} and ${max}`)
  };
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (
  value: number,
  fieldName: string = "Number",
  errorKey?: string
): ValidationResult => {
  const isValid = value > 0;
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `${fieldName} must be a positive number`)
  };
};

/**
 * Validate age based on birth date
 */
export const validateAge = (
  birthDate: Date,
  minAge: number,
  errorKey?: string
): ValidationResult => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const isValid = age >= minAge;
  return {
    isValid,
    error: isValid ? undefined : (errorKey || `You must be at least ${minAge} years old`)
  };
};
