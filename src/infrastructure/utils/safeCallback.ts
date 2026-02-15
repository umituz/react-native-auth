/**
 * Safe Callback Wrapper
 * Standardized error handling for user-provided callbacks
 */

/**
 * Safely executes a user-provided callback with comprehensive error handling
 * Handles both synchronous errors and promise rejections
 *
 * @param callback - The callback to execute (can be sync or async)
 * @param args - Arguments to pass to the callback
 * @param errorPrefix - Prefix for error logging (for debugging)
 * @returns Promise that resolves when callback completes (or fails safely)
 *
 * @example
 * ```typescript
 * // With async callback
 * await safeCallback(onAuthStateChange, [user], '[AuthListener]');
 *
 * // With sync callback
 * await safeCallback(onUserConverted, [anonymousId, authenticatedId], '[AuthStateHandler]');
 * ```
 */
export async function safeCallback<T extends unknown[]>(
  callback: ((...args: T) => void | Promise<void>) | undefined,
  args: T,
  errorPrefix: string = '[Callback]'
): Promise<void> {
  if (!callback) return;

  try {
    const result = callback(...args);

    // If callback returns a promise, await it and catch rejections
    if (result && typeof result.then === 'function') {
      await result.catch((error) => {
        console.error(`${errorPrefix} User callback promise rejected:`, error);
      });
    }
  } catch (error) {
    // Catch synchronous errors
    console.error(`${errorPrefix} User callback error:`, error);
  }
}

/**
 * Synchronously executes a user-provided callback with error handling
 * Use this when you don't want to await the callback (fire-and-forget)
 *
 * @param callback - The callback to execute (can be sync or async)
 * @param args - Arguments to pass to the callback
 * @param errorPrefix - Prefix for error logging (for debugging)
 *
 * @example
 * ```typescript
 * // Fire-and-forget pattern
 * safeCallbackSync(onAuthStateChange, [user], '[AuthListener]');
 * ```
 */
export function safeCallbackSync<T extends unknown[]>(
  callback: ((...args: T) => void | Promise<void>) | undefined,
  args: T,
  errorPrefix: string = '[Callback]'
): void {
  if (!callback) return;

  try {
    const result = callback(...args);

    // If callback returns a promise, catch rejections but don't await
    if (result && typeof result.then === 'function') {
      result.catch((error) => {
        console.error(`${errorPrefix} User callback promise rejected:`, error);
      });
    }
  } catch (error) {
    // Catch synchronous errors
    console.error(`${errorPrefix} User callback error:`, error);
  }
}
