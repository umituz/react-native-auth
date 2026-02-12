/**
 * Configuration Error Mappings
 * Firebase configuration and setup errors
 */

import { AuthConfigurationError } from "../../../../domain/errors/AuthError";
import type { ErrorMapping } from "./errorMapping.types";

export const CONFIG_ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  "auth/configuration-not-found": {
    type: "factory",
    create: () =>
      new AuthConfigurationError(
        "Authentication is not properly configured. Please contact support."
      ),
  },
  "auth/app-not-authorized": {
    type: "factory",
    create: () =>
      new AuthConfigurationError(
        "Authentication is not properly configured. Please contact support."
      ),
  },
  "auth/operation-not-allowed": {
    type: "factory",
    create: () =>
      new AuthConfigurationError(
        "Email/password authentication is not enabled. Please contact support."
      ),
  },
};
