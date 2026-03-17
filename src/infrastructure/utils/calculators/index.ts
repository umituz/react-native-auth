/**
 * Calculator Utilities Index
 * Centralized exports for all calculator utilities
 */

// Auth State Calculator
export {
  calculateUserId,
  calculateHasFirebaseUser,
  calculateIsAnonymous,
  calculateIsAuthenticated,
  calculateUserType,
  calculateIsAuthReady,
  calculateDerivedAuthState,
} from "./authStateCalculator";

// Form Error Collection
export {
  collectFieldErrors,
  extractFieldError,
  hasFieldErrors,
  getFirstErrorMessage,
} from "./formErrorCollection";

// User Profile Calculator
export {
  calculateUserProfileDisplay,
} from "./userProfileCalculator";

// Password Strength Calculator
export {
  calculatePasswordRequirements,
  calculatePasswordsMatch,
  calculatePasswordValidation,
  calculatePasswordStrength,
} from "./passwordStrengthCalculator";
