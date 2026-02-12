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
import {
  createOrUpdateUserDocument,
  getFirestoreInstance
} from "../../repositories/UserDocumentRepository";

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

  try {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      handleAuthStateChange(user, store, auth, autoAnonymousSignIn, onAuthStateChange);
    });

    setUnsubscribe(unsubscribe);
  } catch (error) {
    // If listener setup fails, ensure we clean up and mark as initialized
    console.error("[AuthListener] Failed to setup auth listener:", error);
    completeInitialization();
    store.setLoading(false);
    store.setInitialized(true);
    store.setError("Failed to initialize authentication listener");
    throw error;
  }
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

    // Create or update Firestore user document (best practice)
    if (user) {
      void createOrUpdateUserDocument(getFirestoreInstance(), user);
    }

    // Handle conversion from anonymous
    if (user && !user.isAnonymous && store.isAnonymous) {
      store.setIsAnonymous(false);
    }

    onAuthStateChange?.(user);
  } catch (error) {
    console.error("[AuthListener] Error handling auth state change:", error);
    // Ensure we don't leave the app in a bad state
    store.setInitialized(true);
    store.setLoading(false);
  }
}

/**
 * Handle anonymous mode sign-in
 */
async function handleAnonymousMode(store: Store, auth: Auth): Promise<void> {
  if (!startAnonymousSignIn()) {
    return; // Already signing in
  }

  const handleAnonymousSignIn = createAnonymousSignInHandler(auth, store);

  try {
    await handleAnonymousSignIn();
  } finally {
    completeAnonymousSignIn();
  }
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
