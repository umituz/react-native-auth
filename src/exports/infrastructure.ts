/**
 * Infrastructure Layer Exports
 */

export type { AuthCredentials, SignUpCredentials } from '../infrastructure/repositories/AuthRepository';

// Services
export {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService,
} from '../infrastructure/services/AuthService';
export {
  initializeAuth,
  isAuthInitialized,
  resetAuthInitialization,
} from '../infrastructure/services/initializeAuth';
export type { InitializeAuthOptions } from '../infrastructure/services/initializeAuth';

// Storage
export type { IStorageProvider } from '../infrastructure/types/Storage.types';
export {
  createStorageProvider,
  StorageProviderAdapter,
} from '../infrastructure/adapters/StorageProviderAdapter';

// Validation
export {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
} from '../infrastructure/utils/AuthValidation';
export type {
  ValidationResult,
  PasswordStrengthResult,
  PasswordRequirements,
} from '../infrastructure/utils/AuthValidation';
export type {
  FormValidationError,
  FormValidationResult,
} from '../infrastructure/utils/validation/types';
export {
  SECURITY_LIMITS,
  sanitizeEmail,
  sanitizePassword,
  sanitizeName,
} from '../infrastructure/utils/validation/sanitization';
export type { SecurityLimitKey } from '../infrastructure/utils/validation/sanitization';
export {
  isEmpty,
  isEmptyEmail,
  isEmptyPassword,
  isEmptyName,
  isNotEmpty,
  hasContent,
} from '../infrastructure/utils/validation/validationHelpers';
export { safeCallback, safeCallbackSync } from '../infrastructure/utils/safeCallback';

// Calculators
export {
  calculateUserId,
  calculateHasFirebaseUser,
  calculateIsAnonymous,
  calculateIsAuthenticated,
  calculateUserType,
  calculateIsAuthReady,
  calculateDerivedAuthState,
  collectFieldErrors,
  extractFieldError,
  hasFieldErrors,
  getFirstErrorMessage,
  calculateUserProfileDisplay,
  calculatePasswordRequirements,
  calculatePasswordsMatch,
  calculatePasswordValidation,
  calculatePasswordStrength,
} from '../infrastructure/utils/calculators';
