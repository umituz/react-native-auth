/**
 * Auth Error Handler Hook
 * Shared hook for handling auth errors with localization
 */

import { useCallback } from "react";
import { getAuthErrorLocalizationKey, resolveErrorMessage } from "../utils/getAuthErrorMessage";

export interface UseAuthErrorHandlerConfig {
  translations?: Record<string, string>;
}

export interface UseAuthErrorHandlerResult {
  handleAuthError: (error: unknown) => string;
  getErrorMessage: (key: string) => string;
}

/**
 * Hook to handle auth errors with localization
 * Provides consistent error handling across form hooks
 *
 * @param config - Optional translations configuration
 * @returns Error handler function and error message getter
 *
 * @example
 * ```typescript
 * const { handleAuthError } = useAuthErrorHandler({ translations });
 *
 * try {
 *   await signIn(email, password);
 * } catch (err) {
 *   const errorMessage = handleAuthError(err);
 *   setLocalError(errorMessage);
 * }
 * ```
 */
export function useAuthErrorHandler(
  config?: UseAuthErrorHandlerConfig
): UseAuthErrorHandlerResult {
  const getErrorMessage = useCallback(
    (key: string): string => {
      return resolveErrorMessage(key, config?.translations);
    },
    [config?.translations]
  );

  const handleAuthError = useCallback(
    (error: unknown): string => {
      const localizationKey = getAuthErrorLocalizationKey(error);
      return getErrorMessage(localizationKey);
    },
    [getErrorMessage]
  );

  return {
    handleAuthError,
    getErrorMessage,
  };
}
