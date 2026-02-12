/**
 * Form Validation Types
 * Type definitions for form validation
 */

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  displayName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormValues {
  displayName: string;
  email: string;
}
