/**
 * Firebase Error Code Mapping Constants
 * Centralized configuration for mapping Firebase error codes to domain errors
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
} from "../../../domain/errors/AuthError";

export type ErrorConstructor = new (message?: string) => Error;
export type ErrorFactory = () => Error;

export interface ErrorMapping {
  type: "class" | "factory";
  create: ErrorConstructor | ErrorFactory;
}

/**
 * Firebase error code to domain error mapping
 */
export const ERROR_CODE_MAP: Record<string, ErrorMapping> = {
  "auth/email-already-in-use": {
    type: "class",
    create: AuthEmailAlreadyInUseError,
  },
  "auth/invalid-email": {
    type: "class",
    create: AuthInvalidEmailError,
  },
  "auth/weak-password": {
    type: "class",
    create: AuthWeakPasswordError,
  },
  "auth/user-disabled": {
    type: "factory",
    create: () => new AuthError(
      "Your account has been disabled. Please contact support.",
      "AUTH_USER_DISABLED"
    ),
  },
  "auth/user-not-found": {
    type: "class",
    create: AuthUserNotFoundError,
  },
  "auth/wrong-password": {
    type: "class",
    create: AuthWrongPasswordError,
  },
  "auth/invalid-credential": {
    type: "factory",
    create: () => new AuthError(
      "Invalid email or password. Please check your credentials.",
      "AUTH_INVALID_CREDENTIAL"
    ),
  },
  "auth/invalid-login-credentials": {
    type: "factory",
    create: () => new AuthError(
      "Invalid email or password. Please check your credentials.",
      "AUTH_INVALID_CREDENTIAL"
    ),
  },
  "auth/network-request-failed": {
    type: "class",
    create: AuthNetworkError,
  },
  "auth/too-many-requests": {
    type: "factory",
    create: () => new AuthError(
      "Too many failed attempts. Please wait a few minutes and try again.",
      "AUTH_TOO_MANY_REQUESTS"
    ),
  },
  "auth/configuration-not-found": {
    type: "factory",
    create: () => new AuthConfigurationError(
      "Authentication is not properly configured. Please contact support."
    ),
  },
  "auth/app-not-authorized": {
    type: "factory",
    create: () => new AuthConfigurationError(
      "Authentication is not properly configured. Please contact support."
    ),
  },
  "auth/operation-not-allowed": {
    type: "factory",
    create: () => new AuthConfigurationError(
      "Email/password authentication is not enabled. Please contact support."
    ),
  },
  "auth/requires-recent-login": {
    type: "factory",
    create: () => new AuthError(
      "Please sign in again to complete this action.",
      "AUTH_REQUIRES_RECENT_LOGIN"
    ),
  },
  "auth/expired-action-code": {
    type: "factory",
    create: () => new AuthError(
      "This link has expired. Please request a new one.",
      "AUTH_EXPIRED_ACTION_CODE"
    ),
  },
  "auth/invalid-action-code": {
    type: "factory",
    create: () => new AuthError(
      "This link is invalid. Please request a new one.",
      "AUTH_INVALID_ACTION_CODE"
    ),
  },
};
