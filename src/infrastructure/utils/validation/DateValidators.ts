import { ValidationResult } from './types';

/**
 * Calculate age from a birth date
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

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

  const age = calculateAge(date);

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
