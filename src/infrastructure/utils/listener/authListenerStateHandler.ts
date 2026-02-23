/**
 * Auth State Change Handler
 * Processes Firebase auth state changes and updates store
 */

import type { Auth, User } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { completeInitialization } from "./listenerState.util";
import { handleAnonymousMode } from "./anonymousHandler";
import { safeCallbackSync } from "../safeCallback";

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
      void handleAnonymousMode(store, auth);
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
    safeCallbackSync(onAuthStateChange, [user], '[AuthListener]');
  } catch (error) {
    console.error("[AuthListener] Error handling auth state change:", error);
    // Ensure we don't leave the app in a bad state
    store.setInitialized(true);
    store.setLoading(false);
  }
}
