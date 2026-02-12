/**
 * Authentication Error Mappings
 * Email, password, and credential related errors
 */

import {
  AuthError,
  AuthEmailAlreadyInUseError,
  AuthInvalidEmailError,
  AuthWeakPasswordError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
} from "../../../../domain/errors/AuthError";
import type { ErrorMapping } from "./errorMapping.types";

export const AUTH_ERROR_MAPPINGS: Record<string, ErrorMapping> = {
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
    create: () =>
      new AuthError(
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
    create: () =>
      new AuthError(
        "Invalid email or password. Please check your credentials.",
        "AUTH_INVALID_CREDENTIAL"
      ),
  },
  "auth/invalid-login-credentials": {
    type: "factory",
    create: () =>
      new AuthError(
        "Invalid email or password. Please check your credentials.",
        "AUTH_INVALID_CREDENTIAL"
      ),
  },
  "auth/requires-recent-login": {
    type: "factory",
    create: () =>
      new AuthError(
        "Please sign in again to complete this action.",
        "AUTH_REQUIRES_RECENT_LOGIN"
      ),
  },
};
