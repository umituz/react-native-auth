/**
 * Form Validation Types
 * Type definitions for form validation
 */

// Export shared validation types
export type {
  FormValidationError,
  FormValidationResult,
} from "../../../../infrastructure/utils/validation/types";

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
