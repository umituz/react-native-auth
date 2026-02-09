/**
 * Auth Listener Lifecycle Utilities
 * Handles subscription and cleanup logic for auth listener
 */

import type { Auth, User } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { createAnonymousSignInHandler } from "./anonymousSignInHandler";
import {
  isListenerInitialized,
  completeInitialization,
  setUnsubscribe,
  incrementRefCount,
  decrementRefCount,
  startAnonymousSignIn,
  completeAnonymousSignIn,
  resetListenerState,
} from "./listenerState.util";
import { onIdTokenChanged } from "firebase/auth";
import { getAuthService } from "../../../infrastructure/services/AuthService";

type Store = AuthActions & { isAnonymous: boolean };

/**
 * Create unsubscribe function that decrements ref count
 */
export function createUnsubscribeHandler(): () => void {
  return () => {
    const { shouldCleanup } = decrementRefCount();

    if (shouldCleanup) {
      resetListenerState();
    }
  };
}

/**
 * Return existing unsubscribe if already initialized
 * Returns null if initialization is in progress
 */
export function handleExistingInitialization(): (() => void) | null {
  if (!isListenerInitialized()) {
    return null;
  }

  incrementRefCount();
  return createUnsubscribeHandler();
}

/**
 * Return no-op if initialization is in progress
 */
export function handleInitializationInProgress(): () => void {
  return () => {
    // No-op - handled by initial initialization
  };
}

/**
 * Setup Firebase auth listener
 */
export function setupAuthListener(
  auth: Auth,
  store: Store,
  autoAnonymousSignIn: boolean,
  onAuthStateChange?: (user: User | null) => void
): void {
  const service = getAuthService();

  if (service) {
    const isAnonymous = service.getIsAnonymousMode();
    if (isAnonymous) {
      store.setIsAnonymous(true);
    }
  }

  const unsubscribe = onIdTokenChanged(auth, (user) => {
    handleAuthStateChange(user, store, auth, autoAnonymousSignIn, onAuthStateChange);
  });

  setUnsubscribe(unsubscribe);
}

/**
 * Handle auth state change from Firebase
 */
function handleAuthStateChange(
  user: User | null,
  store: Store,
  auth: Auth,
  autoAnonymousSignIn: boolean,
  onAuthStateChange?: (user: User | null) => void
): void {
  if (!user && autoAnonymousSignIn) {
    handleAnonymousMode(store, auth);
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

  onAuthStateChange?.(user);
}

/**
 * Handle anonymous mode sign-in
 */
function handleAnonymousMode(store: Store, auth: Auth): void {
  if (!startAnonymousSignIn()) {
    return; // Already signing in
  }

  const handleAnonymousSignIn = createAnonymousSignInHandler(auth, store);

  // Start sign-in without blocking
  void (async () => {
    try {
      await handleAnonymousSignIn();
    } finally {
      completeAnonymousSignIn();
    }
  })();
}

/**
 * Handle case where Firebase auth is not available
 */
export function handleNoFirebaseAuth(store: Store): () => void {
  completeInitialization();
  store.setLoading(false);
  store.setInitialized(true);
  return () => {};
}

export function completeListenerSetup() {
  completeInitialization();
}
