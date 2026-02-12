/**
 * Action Code Error Mappings
 * Email verification, password reset link errors
 */

import { AuthError } from "../../../../domain/errors/AuthError";
import type { ErrorMapping } from "./errorMapping.types";

export const ACTION_CODE_ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  "auth/expired-action-code": {
    type: "factory",
    create: () =>
      new AuthError(
        "This link has expired. Please request a new one.",
        "AUTH_EXPIRED_ACTION_CODE"
      ),
  },
  "auth/invalid-action-code": {
    type: "factory",
    create: () =>
      new AuthError(
        "This link is invalid. Please request a new one.",
        "AUTH_INVALID_ACTION_CODE"
      ),
  },
};
