/**
 * Validation Service (Application Layer)
 * Facade for validation functions to be used by presentation layer
 * Follows DDD architecture - presentation imports from application, not infrastructure
 */

export {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../../infrastructure/utils/AuthValidation";

export type {
  PasswordRequirements,
} from "../../infrastructure/utils/validation/types";
