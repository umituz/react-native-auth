/**
 * Anonymous Sign-In Attempt Logic
 */

import { anonymousAuthService } from '@umituz/react-native-firebase';
import type { Auth } from 'firebase/auth';
import type { AnonymousSignInCallbacks, AnonymousSignInOptions } from './types';
import {
  MAX_ANONYMOUS_RETRIES,
  ANONYMOUS_RETRY_DELAY_MS,
  ANONYMOUS_SIGNIN_TIMEOUT_MS,
} from './constants';

/**
 * Perform anonymous sign-in with retry logic
 */
async function performAnonymousSignIn(
  auth: Auth,
  maxRetries: number,
  retryDelay: number
): Promise<void> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await anonymousAuthService.signInAnonymously(auth);
      return;
    } catch (error) {
      // If not last attempt, wait and retry
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      // All attempts failed
      throw error;
    }
  }
}

/**
 * Attempt anonymous sign-in with retry logic and timeout protection
 */
export async function attemptAnonymousSignIn(
  auth: Auth,
  callbacks: AnonymousSignInCallbacks,
  options: AnonymousSignInOptions = {}
): Promise<void> {
  const {
    maxRetries = MAX_ANONYMOUS_RETRIES,
    retryDelay = ANONYMOUS_RETRY_DELAY_MS,
    timeout = ANONYMOUS_SIGNIN_TIMEOUT_MS,
  } = options;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    // Add timeout protection with proper cleanup
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error('Anonymous sign-in timeout')),
        timeout
      );
    });

    // Race between sign-in and timeout
    await Promise.race([
      performAnonymousSignIn(auth, maxRetries, retryDelay),
      timeoutPromise,
    ]);

    callbacks.onSignInSuccess();
  } catch (error) {
    const signInError =
      error instanceof Error ? error : new Error('Unknown sign-in error');
    callbacks.onSignInFailure(signInError);
  } finally {
    // Always clear timeout to prevent timer leaks
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
