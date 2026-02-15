/**
 * Local Error Hook
 * Shared hook for managing local error state in form components
 */

import { useState, useCallback, type Dispatch, type SetStateAction } from "react";

export interface UseLocalErrorResult {
  localError: string | null;
  setLocalError: Dispatch<SetStateAction<string | null>>;
  clearLocalError: () => void;
}

/**
 * Hook to manage local error state
 * Provides consistent error state management across form hooks
 *
 * @returns Local error state and handlers
 *
 * @example
 * ```typescript
 * const { localError, setLocalError, clearLocalError } = useLocalError();
 *
 * // Set error
 * setLocalError("Invalid email");
 *
 * // Clear error
 * clearLocalError();
 * ```
 */
export function useLocalError(): UseLocalErrorResult {
  const [localError, setLocalError] = useState<string | null>(null);

  const clearLocalError = useCallback(() => {
    setLocalError(null);
  }, []);

  return {
    localError,
    setLocalError,
    clearLocalError,
  };
}
