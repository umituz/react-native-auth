/**
 * Auth State Change Handler
 * Processes Firebase auth state changes and updates store
 */

import type { Auth, User } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { handleAnonymousMode } from "./anonymousHandler";
import { safeCallbackSync } from "../safeCallback";

type StoreActions = AuthActions;
type GetIsAnonymous = () => boolean;

/**
 * Handle auth state change from Firebase
 */
export function handleAuthStateChange(
  user: User | null,
  store: StoreActions,
  auth: Auth,
  autoAnonymousSignIn: boolean,
  onAuthStateChange?: (user: User | null) => void | Promise<void>,
  getIsAnonymous?: GetIsAnonymous
): void {
  try {
    if (!user && autoAnonymousSignIn) {
      // Don't call completeInitialization here - handleAnonymousMode
      // will set initialized/loading when anonymous sign-in completes or fails.
      void handleAnonymousMode(store, auth);
      return;
    }

    store.setFirebaseUser(user);
    store.setInitialized(true);

    // Handle conversion from anonymous - read fresh state, not stale snapshot
    const currentIsAnonymous = getIsAnonymous ? getIsAnonymous() : false;
    if (user && !user.isAnonymous && currentIsAnonymous) {
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
