/**
 * Form Validation - Main Export
 * Exports all form validation utilities
 */

// Types
export type {
  FormValidationError,
  FormValidationResult,
  LoginFormValues,
  RegisterFormValues,
  ProfileFormValues,
} from "./validation/formValidation.types";

// Validators
export {
  validateLoginForm,
  validateRegisterForm,
  validateProfileForm,
} from "./validation/formValidators";

// Utilities
export { errorsToFieldErrors } from "./validation/formValidation.utils";

// Hook
export { useFormValidation } from "./validation/formValidation.hook";
