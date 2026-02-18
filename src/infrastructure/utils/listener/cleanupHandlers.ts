/**
 * Cleanup Handlers
 * Manages unsubscribe and cleanup logic for auth listener
 */

import {
  isListenerInitialized,
  incrementRefCount,
  decrementRefCount,
  resetListenerState,
} from "./listenerState.util";

/**
 * Create unsubscribe function that decrements ref count
 */
function createUnsubscribeHandler(): () => void {
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
