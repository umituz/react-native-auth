/**
 * Auth Error Mapper
 * Single Responsibility: Map Firebase Auth errors to domain errors
 *
 * @module AuthErrorMapper
 * @description Provides type-safe error mapping from Firebase Auth errors to
 * domain-specific error types. Includes runtime validation and type guards.
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
 * Firebase Auth error structure
 * Based on Firebase Auth SDK error format
 */
interface FirebaseAuthError {
  code: string;
  message: string;
  name?: string;
  stack?: string;
}

/**
 * Type guard to check if error is a valid Firebase Auth error
 * @param error - Unknown error to check
 * @returns True if error matches Firebase Auth error structure
 */
function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as Partial<FirebaseAuthError>;
  return (
    typeof err.code === 'string' &&
    typeof err.message === 'string' &&
    err.code.startsWith('auth/')
  );
}

/**
 * Extract error code from error object
 * @param error - Unknown error
 * @returns Error code or empty string
 */
function extractErrorCode(error: unknown): string {
  if (isFirebaseAuthError(error)) {
    return error.code;
  }

  // Fallback for non-Firebase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') {
      return code;
    }
  }

  return '';
}

/**
 * Extract error message from error object
 * @param error - Unknown error
 * @returns Error message or default message
 */
function extractErrorMessage(error: unknown): string {
  if (isFirebaseAuthError(error)) {
    return error.message;
  }

  // Fallback for Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return "Authentication failed";
}

/**
 * Map Firebase Auth errors to domain errors
 *
 * @param error - Unknown error from Firebase Auth or other sources
 * @returns Mapped domain error with appropriate error type and message
 *
 * @example
 * ```ts
 * try {
 *   await signInWithEmailAndPassword(auth, email, password);
 * } catch (error) {
 *   throw mapFirebaseAuthError(error);
 * }
 * ```
 *
 * @remarks
 * This function handles:
 * - Firebase Auth errors with proper code mapping
 * - Standard JavaScript Error objects
 * - Unknown error types with safe fallbacks
 * - Type-safe error extraction using type guards
 */
export function mapFirebaseAuthError(error: unknown): Error {
  // Handle null/undefined
  if (!error || typeof error !== 'object') {
    return new AuthError("Authentication failed", "AUTH_UNKNOWN_ERROR");
  }

  const code = extractErrorCode(error);
  const message = extractErrorMessage(error);

  // Map known Firebase Auth error codes to domain errors
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
      // Log unknown errors in development for debugging
      if (__DEV__ && code) {
        console.warn(`[AuthErrorMapper] Unknown Firebase Auth code: ${code}`, error);
      }
      return new AuthError(message, code || "AUTH_UNKNOWN_ERROR");
  }
}

/**
 * Check if error is a network-related error
 * @param error - Error to check
 * @returns True if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof AuthNetworkError ||
    (error instanceof AuthError && error.code === "auth/network-request-failed")
  );
}

/**
 * Check if error is a configuration-related error
 * @param error - Error to check
 * @returns True if error is configuration-related
 */
export function isConfigurationError(error: unknown): boolean {
  return error instanceof AuthConfigurationError;
}

