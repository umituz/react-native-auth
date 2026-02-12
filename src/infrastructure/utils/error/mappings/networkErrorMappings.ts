/**
 * Network Error Mappings
 * Network and rate limit errors
 */

import { AuthError, AuthNetworkError } from "../../../../domain/errors/AuthError";
import type { ErrorMapping } from "./errorMapping.types";

export const NETWORK_ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  "auth/network-request-failed": {
    type: "class",
    create: AuthNetworkError,
  },
  "auth/too-many-requests": {
    type: "factory",
    create: () =>
      new AuthError(
        "Too many failed attempts. Please wait a few minutes and try again.",
        "AUTH_TOO_MANY_REQUESTS"
      ),
  },
};
