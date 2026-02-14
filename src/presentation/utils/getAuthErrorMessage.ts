/**
 * Get localized error message from AuthError
 * Maps error codes to localization keys
 */

import { AuthError } from "../../domain/errors/AuthError";

/**
 * Map AuthError code to localization key
 */
export function getAuthErrorLocalizationKey(error: unknown): string {
  // Handle non-Error types
  if (!(error instanceof Error)) {
    return "auth.errors.unknownError";
  }

  const code = error instanceof AuthError ? error.code : undefined;

  // Map error codes to localization keys
  const errorCodeMap: Record<string, string> = {
    AUTH_INVALID_EMAIL: "auth.errors.invalidEmail",
    AUTH_WEAK_PASSWORD: "auth.errors.weakPassword",
    AUTH_USER_NOT_FOUND: "auth.errors.userNotFound",
    AUTH_WRONG_PASSWORD: "auth.errors.wrongPassword",
    AUTH_EMAIL_ALREADY_IN_USE: "auth.errors.emailAlreadyInUse",
    AUTH_NETWORK_ERROR: "auth.errors.networkError",
    AUTH_CONFIG_ERROR: "auth.errors.configurationError",
    AUTH_TOO_MANY_REQUESTS: "auth.errors.tooManyRequests",
    AUTH_USER_DISABLED: "auth.errors.userDisabled",
    AUTH_NOT_INITIALIZED: "auth.errors.authNotInitialized",
    AUTH_INVALID_CREDENTIAL: "auth.errors.invalidCredential",
    "auth/invalid-email": "auth.errors.invalidEmail",
    "auth/weak-password": "auth.errors.weakPassword",
    "auth/user-not-found": "auth.errors.invalidCredential",
    "auth/wrong-password": "auth.errors.invalidCredential",
    "auth/email-already-in-use": "auth.errors.emailAlreadyInUse",
    "auth/network-request-failed": "auth.errors.networkError",
    "auth/too-many-requests": "auth.errors.tooManyRequests",
    "auth/user-disabled": "auth.errors.userDisabled",
    "auth/invalid-credential": "auth.errors.invalidCredential",
    "auth/invalid-login-credentials": "auth.errors.invalidCredential",
  };

  // Check error name for specific error types
  const errorNameMap: Record<string, string> = {
    AuthInvalidEmailError: "auth.errors.invalidEmail",
    AuthWeakPasswordError: "auth.errors.weakPassword",
    AuthUserNotFoundError: "auth.errors.userNotFound",
    AuthWrongPasswordError: "auth.errors.wrongPassword",
    AuthEmailAlreadyInUseError: "auth.errors.emailAlreadyInUse",
    AuthNetworkError: "auth.errors.networkError",
    AuthConfigurationError: "auth.errors.configurationError",
    AuthInitializationError: "auth.errors.authNotInitialized",
  };

  // First check by error name (most specific)
  const mappedByName = errorNameMap[error.name];
  if (mappedByName) {
    return mappedByName;
  }

  // Then check by error code
  if (code && errorCodeMap[code]) {
    return errorCodeMap[code];
  }

  // Default to unknown error - don't leak system information through error messages
  return "auth.errors.unknownError";
}

/**
 * Resolve an error key to a localized message using the provided error map.
 * Falls back to the key itself if no translation is found.
 */
export function resolveErrorMessage(key: string, errors?: Record<string, string>): string {
  return errors?.[key] || key;
}
