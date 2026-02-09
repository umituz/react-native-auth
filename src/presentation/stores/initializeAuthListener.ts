/**
 * Auth Listener Initialization
 * Sets up Firebase auth token listener with optional auto anonymous sign-in
 * Uses onIdTokenChanged for profile updates (displayName, email)
 */

import { getFirebaseAuth } from "@umituz/react-native-firebase";
import { useAuthStore } from "./authStore";
import type { AuthListenerOptions } from "../../types/auth-store.types";
import {
  handleExistingInitialization,
  handleInitializationInProgress,
  handleNoFirebaseAuth,
  setupAuthListener,
  completeListenerSetup,
} from "../../infrastructure/utils/listener/listenerLifecycle.util";
import {
  isInitializationInProgress,
  isListenerInitialized,
  resetListenerState,
  decrementRefCount,
} from "../../infrastructure/utils/listener/listenerState.util";

/**
 * Initialize Firebase auth listener
 * Call once in app root, returns unsubscribe function
 */
export function initializeAuthListener(
  options: AuthListenerOptions = {}
): () => void {
  const { autoAnonymousSignIn = true, onAuthStateChange } = options;

  // Prevent duplicate initialization
  if (isInitializationInProgress()) {
    return handleInitializationInProgress();
  }

  // If already initialized, increment ref count and return unsubscribe
  if (isListenerInitialized()) {
    return handleExistingInitialization()!;
  }

  const auth = getFirebaseAuth();
  const store = useAuthStore.getState();

  if (!auth) {
    return handleNoFirebaseAuth(store);
  }

  // Setup the listener
  setupAuthListener(auth, store, autoAnonymousSignIn, onAuthStateChange);
  completeListenerSetup();

  // Return cleanup function
  return () => {
    const { shouldCleanup } = decrementRefCount();

    if (shouldCleanup) {
      resetListenerState();
    }
  };
}

/**
 * Reset listener state (for testing)
 */
export function resetAuthListener(): void {
  resetListenerState();
}

/**
 * Check if listener is initialized
 */
export function isAuthListenerInitialized(): boolean {
  return isListenerInitialized();
}
