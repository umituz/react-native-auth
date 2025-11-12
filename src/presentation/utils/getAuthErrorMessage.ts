/**
 * Get localized error message from AuthError
 * Maps error codes to localization keys
 */

import type { AuthError } from "../../domain/errors/AuthError";

/**
 * Map AuthError code to localization key
 */
export function getAuthErrorLocalizationKey(error: Error): string {
  // Check if error has code property
  const code = (error as any).code;

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



