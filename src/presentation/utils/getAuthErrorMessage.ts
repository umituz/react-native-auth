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
  };

  // Check error name for specific error types
  if (error.name === "AuthInvalidEmailError") {
    return "auth.errors.invalidEmail";
  }
  if (error.name === "AuthWeakPasswordError") {
    return "auth.errors.weakPassword";
  }
  if (error.name === "AuthUserNotFoundError") {
    return "auth.errors.userNotFound";
  }
  if (error.name === "AuthWrongPasswordError") {
    return "auth.errors.wrongPassword";
  }
  if (error.name === "AuthEmailAlreadyInUseError") {
    return "auth.errors.emailAlreadyInUse";
  }
  if (error.name === "AuthNetworkError") {
    return "auth.errors.networkError";
  }
  if (error.name === "AuthConfigurationError") {
    return "auth.errors.configurationError";
  }
  if (error.name === "AuthInitializationError") {
    return "auth.errors.authNotInitialized";
  }

  // Use code if available
  if (code && errorCodeMap[code]) {
    return errorCodeMap[code];
  }

  // Check error message for specific patterns
  const message = error.message.toLowerCase();
  if (message.includes("too many requests")) {
    return "auth.errors.tooManyRequests";
  }
  if (message.includes("user account has been disabled") || message.includes("user disabled")) {
    return "auth.errors.userDisabled";
  }
  if (message.includes("not properly configured") || message.includes("configuration")) {
    return "auth.errors.configurationError";
  }
  if (message.includes("not enabled") || message.includes("operation not allowed")) {
    return "auth.errors.operationNotAllowed";
  }

  // Default to unknown error
  return "auth.errors.unknownError";
}

/**
 * Resolve an error key to a localized message using the provided error map.
 * Falls back to the key itself if no translation is found.
 */
export function resolveErrorMessage(key: string, errors?: Record<string, string>): string {
  return errors?.[key] || key;
}
