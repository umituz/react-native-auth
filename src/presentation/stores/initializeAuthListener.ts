/**
 * Auth Listener Initialization
 * Sets up Firebase auth state listener with optional auto anonymous sign-in
 */

import { onAuthStateChanged } from "firebase/auth";
import {
  getFirebaseAuth,
  anonymousAuthService,
} from "@umituz/react-native-firebase";
import { useAuthStore } from "./authStore";
import { getAuthService } from "../../infrastructure/services/AuthService";
import type { AuthListenerOptions } from "../../types/auth-store.types";

declare const __DEV__: boolean;

let listenerInitialized = false;

/**
 * Initialize Firebase auth listener
 * Call once in app root, returns unsubscribe function
 *
 * @param options - Configuration options
 * @param options.autoAnonymousSignIn - Enable auto anonymous sign-in (default: true)
 * @param options.onAuthStateChange - Callback when auth state changes
 */
export function initializeAuthListener(
  options: AuthListenerOptions = {}
): () => void {
  const { autoAnonymousSignIn = true, onAuthStateChange } = options;

  if (listenerInitialized) {
    return () => {};
  }

  const auth = getFirebaseAuth();
  const store = useAuthStore.getState();

  if (!auth) {
    store.setLoading(false);
    store.setInitialized(true);
    return () => {};
  }

  const service = getAuthService();
  if (service) {
    const isGuest = service.getIsGuestMode();
    if (isGuest) {
      store.setIsGuest(true);
    }
  }

  listenerInitialized = true;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[authStore] Auth state changed:", user?.uid ?? "null");
    }

    // Auto sign-in anonymously if no user and autoAnonymousSignIn is enabled
    if (!user && autoAnonymousSignIn) {
      void (async () => {
        try {
          if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.log("[authStore] Auto signing in anonymously...");
          }
          await anonymousAuthService.signInAnonymously(auth);
          // The listener will be called again with the new anonymous user
        } catch (error) {
          if (typeof __DEV__ !== "undefined" && __DEV__) {
            // eslint-disable-next-line no-console
            console.warn("[authStore] Auto anonymous sign-in failed:", error);
          }
          // Continue with null user if anonymous sign-in fails
          store.setFirebaseUser(null);
          store.setInitialized(true);
        }
      })();
      return;
    }

    store.setFirebaseUser(user);
    store.setInitialized(true);

    if (user && !user.isAnonymous && store.isGuest) {
      store.setIsGuest(false);
    }

    // Call optional callback
    onAuthStateChange?.(user);
  });

  return () => {
    unsubscribe();
    listenerInitialized = false;
  };
}

/**
 * Reset listener state (for testing)
 */
export function resetAuthListener(): void {
  listenerInitialized = false;
}

/**
 * Check if listener is initialized
 */
export function isAuthListenerInitialized(): boolean {
  return listenerInitialized;
}
