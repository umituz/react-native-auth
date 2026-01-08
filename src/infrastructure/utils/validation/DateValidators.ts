import { ValidationResult } from './types';

/**
 * Validate date of birth
 */
export const validateDateOfBirth = (
  date: Date,
  minAge: number = 13,
  errorKey?: string
): ValidationResult => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { isValid: false, error: errorKey || `You must be at least ${minAge} years old` };
  }

  if (age > 120) {
    return { isValid: false, error: "Please enter a valid date of birth" };
  }

  return { isValid: true };
};

/**
 * Date range validation
 * Validates date is within a specific range
 */
export const validateDateRange = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  fieldName: string = "Date",
  errorKey?: string
): ValidationResult => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return { isValid: false, error: errorKey || `Please enter a valid ${fieldName.toLowerCase()}` };
  }

  if (minDate && date < minDate) {
    return {
      isValid: false,
      error: errorKey || `${fieldName} cannot be before ${minDate.toLocaleDateString()}`,
    };
  }

  if (maxDate && date > maxDate) {
    return {
      isValid: false,
      error: errorKey || `${fieldName} cannot be after ${maxDate.toLocaleDateString()}`,
    };
  }

  return { isValid: true };
};
