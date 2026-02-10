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
  AuthNetworkError,
} from "../../domain/errors/AuthError";
import {
  extractErrorCode,
  extractErrorMessage,
} from "./error/errorExtraction";
import { ERROR_CODE_MAP, type ErrorConstructor, type ErrorFactory } from "./error/errorCodeMapping.constants";

/**
 * Create error from error mapping
 * @param mapping - Error mapping configuration
 * @returns Created error instance
 */
function createErrorFromMapping(mapping: { type: "class" | "factory"; create: ErrorConstructor | ErrorFactory }): Error {
  return mapping.type === "class"
    ? new (mapping.create as ErrorConstructor)()
    : (mapping.create as ErrorFactory)();
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
  const mapping = ERROR_CODE_MAP[code];
  if (mapping) {
    return createErrorFromMapping(mapping);
  }

  // Default fallback for unknown error codes
  return new AuthError(message, code || "AUTH_UNKNOWN_ERROR");
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

