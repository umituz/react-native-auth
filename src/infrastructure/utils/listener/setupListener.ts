/**
 * Setup Auth Listener
 * Configures Firebase auth listener with timeout protection
 */

import type { Auth, User } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { getAuthService } from "../../services/AuthService";
import { completeInitialization, setUnsubscribe } from "./listenerState.util";
import { handleAuthStateChange } from "./authListenerStateHandler";

const AUTH_LISTENER_TIMEOUT_MS = 10000;

type StoreActions = AuthActions;

/**
 * Setup Firebase auth listener with timeout protection
 * @param getIsAnonymous - Function to read fresh isAnonymous state (avoids stale snapshots)
 */
export function setupAuthListener(
  auth: Auth,
  store: StoreActions,
  autoAnonymousSignIn: boolean,
  onAuthStateChange?: (user: User | null) => void | Promise<void>,
  getIsAnonymous?: () => boolean
): void {
  const service = getAuthService();

  if (service) {
    const isAnonymous = service.getIsAnonymousMode();
    if (isAnonymous) {
      store.setIsAnonymous(true);
    }
  }

  // Safety timeout: if listener doesn't trigger within AUTH_LISTENER_TIMEOUT_MS, mark as initialized
  let hasTriggered = false;
  const timeout = setTimeout(() => {
    if (!hasTriggered) {
      if (__DEV__) {
        console.warn("[AuthListener] Auth listener timeout - marking as initialized");
      }
      store.setInitialized(true);
      store.setLoading(false);
    }
  }, AUTH_LISTENER_TIMEOUT_MS);

  try {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!hasTriggered) {
        hasTriggered = true;
        clearTimeout(timeout);
      }
      handleAuthStateChange(user, store, auth, autoAnonymousSignIn, onAuthStateChange, getIsAnonymous);
    });

    setUnsubscribe(unsubscribe);
  } catch (error) {
    clearTimeout(timeout);
    // If listener setup fails, ensure we clean up and mark as initialized
    if (__DEV__) {
      console.error("[AuthListener] Failed to setup auth listener:", error);
    }
    completeInitialization();
    store.setLoading(false);
    store.setInitialized(true);
    store.setError("Failed to initialize authentication listener");
    // Don't re-throw - app state is already cleaned up and consistent
  }
}
