/**
 * Auth State Change Handler
 * Processes Firebase auth state changes and updates store
 */

import type { Auth, User } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { completeInitialization } from "./listenerState.util";
import { handleAnonymousMode } from "./anonymousHandler";

type Store = AuthActions & { isAnonymous: boolean };

/**
 * Handle auth state change from Firebase
 */
export function handleAuthStateChange(
  user: User | null,
  store: Store,
  auth: Auth,
  autoAnonymousSignIn: boolean,
  onAuthStateChange?: (user: User | null) => void | Promise<void>
): void {
  try {
    if (!user && autoAnonymousSignIn) {
      // Start anonymous sign-in without blocking
      void handleAnonymousMode(store, auth);
      store.setFirebaseUser(null);
      completeInitialization();
      return;
    }

    store.setFirebaseUser(user);
    store.setInitialized(true);

    // Handle conversion from anonymous
    if (user && !user.isAnonymous && store.isAnonymous) {
      store.setIsAnonymous(false);
    }

    // Call user callback with proper error handling for async callbacks
    if (onAuthStateChange) {
      try {
        const result = onAuthStateChange(user);
        // If callback returns a promise, catch rejections
        if (result && typeof result.then === 'function') {
          result.catch((error) => {
            console.error("[AuthListener] User callback promise rejected:", error);
          });
        }
      } catch (error) {
        console.error("[AuthListener] User callback error:", error);
      }
    }
  } catch (error) {
    console.error("[AuthListener] Error handling auth state change:", error);
    // Ensure we don't leave the app in a bad state
    store.setInitialized(true);
    store.setLoading(false);
  }
}
