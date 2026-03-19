/**
 * Create Anonymous Sign-In Handler
 * Factory function for creating anonymous sign-in handlers
 */

import type { Auth } from 'firebase/auth';
import type { AnonymousStore } from './types';
import { attemptAnonymousSignIn } from './attemptAnonymousSignIn';
import {
  MAX_ANONYMOUS_RETRIES,
  ANONYMOUS_RETRY_DELAY_MS,
  ANONYMOUS_SIGNIN_TIMEOUT_MS,
} from './constants';

/**
 * Create anonymous sign-in handler for auth listener
 * Returns a function that can be called when no user is detected
 */
export function createAnonymousSignInHandler(
  auth: Auth | null,
  store: AnonymousStore
): () => Promise<void> {
  return async () => {
    if (!auth) {
      store.setFirebaseUser(null);
      store.setLoading(false);
      store.setInitialized(true);
      return;
    }

    store.setLoading(true);

    await attemptAnonymousSignIn(
      auth,
      {
        onSignInSuccess: () => {
          // Listener will be triggered again with the new user
        },
        onSignInFailure: (error: Error) => {
          if (__DEV__) {
            console.error('[AnonymousSignIn] Failed:', error.message);
          }
          store.setFirebaseUser(null);
          store.setLoading(false);
          store.setInitialized(true);
          store.setError(
            'Failed to sign in anonymously. Please check your connection.'
          );
        },
      },
      {
        maxRetries: MAX_ANONYMOUS_RETRIES,
        retryDelay: ANONYMOUS_RETRY_DELAY_MS,
        timeout: ANONYMOUS_SIGNIN_TIMEOUT_MS,
      }
    );
  };
}
