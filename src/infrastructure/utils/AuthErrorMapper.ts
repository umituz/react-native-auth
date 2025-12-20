/**
 * Auth Error Mapper
 * Single Responsibility: Map Firebase Auth errors to domain errors
 */

import {
  AuthError,
  AuthConfigurationError,
  AuthEmailAlreadyInUseError,
  AuthInvalidEmailError,
  AuthWeakPasswordError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
  AuthNetworkError,
} from "../../domain/errors/AuthError";

/**
 * Map Firebase Auth errors to domain errors
 */
export function mapFirebaseAuthError(error: unknown): Error {
  if (!error || typeof error !== 'object') {
    return new AuthError("Authentication failed", "AUTH_UNKNOWN_ERROR");
  }

  const errorObj = error as { code?: string; message?: string };
  const code = errorObj.code || "";
  const message = errorObj.message || "Authentication failed";

  switch (code) {
    case "auth/email-already-in-use":
      return new AuthEmailAlreadyInUseError();

    case "auth/invalid-email":
      return new AuthInvalidEmailError();

    case "auth/weak-password":
      return new AuthWeakPasswordError();

    case "auth/user-disabled":
      return new AuthError(
        "Your account has been disabled. Please contact support.",
        "AUTH_USER_DISABLED"
      );

    case "auth/user-not-found":
      return new AuthUserNotFoundError();

    case "auth/wrong-password":
      return new AuthWrongPasswordError();

    case "auth/invalid-credential":
      return new AuthError(
        "Invalid email or password. Please check your credentials.",
        "AUTH_INVALID_CREDENTIAL"
      );

    case "auth/invalid-login-credentials":
      return new AuthError(
        "Invalid email or password. Please check your credentials.",
        "AUTH_INVALID_CREDENTIAL"
      );

    case "auth/network-request-failed":
      return new AuthNetworkError();

    case "auth/too-many-requests":
      return new AuthError(
        "Too many failed attempts. Please wait a few minutes and try again.",
        "AUTH_TOO_MANY_REQUESTS"
      );

    case "auth/configuration-not-found":
    case "auth/app-not-authorized":
      return new AuthConfigurationError(
        "Authentication is not properly configured. Please contact support."
      );

    case "auth/operation-not-allowed":
      return new AuthConfigurationError(
        "Email/password authentication is not enabled. Please contact support."
      );

    case "auth/requires-recent-login":
      return new AuthError(
        "Please sign in again to complete this action.",
        "AUTH_REQUIRES_RECENT_LOGIN"
      );

    case "auth/expired-action-code":
      return new AuthError(
        "This link has expired. Please request a new one.",
        "AUTH_EXPIRED_ACTION_CODE"
      );

    case "auth/invalid-action-code":
      return new AuthError(
        "This link is invalid. Please request a new one.",
        "AUTH_INVALID_ACTION_CODE"
      );

    default:
      return new AuthError(message, code || "AUTH_UNKNOWN_ERROR");
  }
}

