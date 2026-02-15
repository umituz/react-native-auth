/**
 * Validation Service (Application Layer)
 * Facade for validation functions to be used by presentation layer
 * Follows DDD architecture - presentation imports from application, not infrastructure
 */

// Validation functions
export {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
} from "../../infrastructure/utils/AuthValidation";

// validation types
export type {
  ValidationResult,
  PasswordStrengthResult,
  PasswordRequirements,
  BaseValidationResult,
  FormValidationError,
  FormValidationResult,
} from "../../infrastructure/utils/validation/types";

// validation helpers
export {
  isEmpty,
  isEmptyEmail,
  isEmptyPassword,
  isEmptyName,
  isNotEmpty,
  hasContent,
} from "../../infrastructure/utils/validation/validationHelpers";

// Sanitization functions
export {
  sanitizeEmail,
  sanitizePassword,
  sanitizeName,
  SECURITY_LIMITS,
} from "../../infrastructure/utils/validation/sanitization";

export type { SecurityLimitKey } from "../../infrastructure/utils/validation/sanitization";
