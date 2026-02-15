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

type Store = AuthActions & { isAnonymous: boolean };

/**
 * Setup Firebase auth listener with timeout protection
 */
export function setupAuthListener(
  auth: Auth,
  store: Store,
  autoAnonymousSignIn: boolean,
  onAuthStateChange?: (user: User | null) => void | Promise<void>
): void {
  const service = getAuthService();

  if (service) {
    const isAnonymous = service.getIsAnonymousMode();
    if (isAnonymous) {
      store.setIsAnonymous(true);
    }
  }

  // Safety timeout: if listener doesn't trigger within 10 seconds, mark as initialized
  let hasTriggered = false;
  const timeout = setTimeout(() => {
    if (!hasTriggered) {
      console.warn("[AuthListener] Auth listener timeout - marking as initialized");
      store.setInitialized(true);
      store.setLoading(false);
    }
  }, 10000);

  try {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      if (!hasTriggered) {
        hasTriggered = true;
        clearTimeout(timeout);
      }
      handleAuthStateChange(user, store, auth, autoAnonymousSignIn, onAuthStateChange);
    });

    setUnsubscribe(unsubscribe);
  } catch (error) {
    clearTimeout(timeout);
    // If listener setup fails, ensure we clean up and mark as initialized
    console.error("[AuthListener] Failed to setup auth listener:", error);
    completeInitialization();
    store.setLoading(false);
    store.setInitialized(true);
    store.setError("Failed to initialize authentication listener");
    // Don't re-throw - app state is already cleaned up and consistent
  }
}
