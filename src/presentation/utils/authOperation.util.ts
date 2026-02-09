/**
 * Auth Operation Utilities
 * Shared error handling for authentication operations
 */

import { useCallback } from "react";

export interface AuthOperationOptions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onSuccess?: () => void;
}

/**
 * Create an auth operation wrapper with consistent error handling
 */
export function createAuthOperation<T>(
  mutation: (params: T) => Promise<unknown>,
  options: AuthOperationOptions
) {
  const { setLoading, setError, onSuccess } = options;

  return useCallback(
    async (params: T) => {
      try {
        setLoading(true);
        setError(null);
        await mutation(params);
        onSuccess?.();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Operation failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, onSuccess, mutation]
  );
}

/**
 * Create auth operation that doesn't throw on failure
 */
export function createSilentAuthOperation<T>(
  mutation: (params: T) => Promise<unknown>,
  options: AuthOperationOptions
) {
  const { setLoading, setError, onSuccess } = options;

  return useCallback(
    async (params?: T) => {
      try {
        setLoading(true);
        setError(null);
        await mutation(params as T);
        onSuccess?.();
      } catch {
        // Silently fail
        onSuccess?.();
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, onSuccess, mutation]
  );
}
