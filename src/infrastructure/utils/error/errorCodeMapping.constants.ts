/**
 * Firebase Error Code Mapping Constants
 * Centralized configuration for mapping Firebase error codes to domain errors
 */

import type { ErrorMapping } from "./mappings/errorMapping.types";
import { AUTH_ERROR_MAPPINGS } from "./mappings/authErrorMappings";
import { CONFIG_ERROR_MAPPINGS } from "./mappings/configErrorMappings";
import { NETWORK_ERROR_MAPPINGS } from "./mappings/networkErrorMappings";
import { ACTION_CODE_ERROR_MAPPINGS } from "./mappings/actionCodeErrorMappings";

// Export types needed by AuthErrorMapper
export type { ErrorConstructor, ErrorFactory } from "./mappings/errorMapping.types";

/**
 * Combined Firebase error code to domain error mapping
 */
export const ERROR_CODE_MAP: Record<string, ErrorMapping> = {
  ...AUTH_ERROR_MAPPINGS,
  ...CONFIG_ERROR_MAPPINGS,
  ...NETWORK_ERROR_MAPPINGS,
  ...ACTION_CODE_ERROR_MAPPINGS,
};
