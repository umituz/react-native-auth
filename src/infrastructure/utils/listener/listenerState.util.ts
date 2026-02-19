/**
 * Auth Listener State Management
 * Manages the state of Firebase auth listener initialization and lifecycle
 */

interface ListenerState {
  initialized: boolean;
  refCount: number;
  initializationInProgress: boolean;
  anonymousSignInInProgress: boolean;
  cleanupInProgress: boolean;
  unsubscribe: (() => void) | null;
}

const state: ListenerState = {
  initialized: false,
  refCount: 0,
  initializationInProgress: false,
  anonymousSignInInProgress: false,
  cleanupInProgress: false,
  unsubscribe: null,
};

/**
 * Check if listener is initialized
 */
export function isListenerInitialized(): boolean {
  return state.initialized;
}

/**
 * Mark initialization as started
 */
export function startInitialization(): boolean {
  if (state.initializationInProgress) {
    return false; // Already initializing
  }
  state.initializationInProgress = true;
  return true;
}

/**
 * Complete initialization
 * If refCount is 0, set to 1 (first subscriber)
 * Otherwise, keep existing refCount from concurrent subscribers
 */
export function completeInitialization(): void {
  state.initializationInProgress = false;
  state.initialized = true;
  // Only set refCount to 1 if it's still 0 (no concurrent subscribers)
  if (state.refCount === 0) {
    state.refCount = 1;
  }
}

/**
 * Set the unsubscribe function
 */
export function setUnsubscribe(fn: (() => void) | null): void {
  state.unsubscribe = fn;
}

/**
 * Increment reference count when a new subscriber joins
 */
export function incrementRefCount(): number {
  state.refCount++;
  return state.refCount;
}

/**
 * Decrement reference count when a subscriber leaves
 * Returns true if cleanup should be performed
 * Uses cleanupInProgress flag to prevent concurrent cleanup attempts
 */
export function decrementRefCount(): { shouldCleanup: boolean; count: number } {
  // Prevent refCount from going negative
  if (state.refCount > 0) {
    state.refCount--;
  }

  const shouldCleanup =
    state.refCount <= 0 &&
    state.unsubscribe !== null &&
    !state.cleanupInProgress;

  // If cleanup should happen, mark as in progress to prevent concurrent cleanup.
  // This flag is reset in resetListenerState() which MUST be called after cleanup.
  if (shouldCleanup) {
    state.cleanupInProgress = true;
  }

  return { shouldCleanup, count: state.refCount };
}

/**
 * Mark anonymous sign-in as in progress
 */
export function startAnonymousSignIn(): boolean {
  if (state.anonymousSignInInProgress) {
    return false; // Already signing in
  }
  state.anonymousSignInInProgress = true;
  return true;
}

/**
 * Mark anonymous sign-in as complete
 */
export function completeAnonymousSignIn(): void {
  state.anonymousSignInInProgress = false;
}

/**
 * Reset all state (for testing and cleanup)
 */
export function resetListenerState(): void {
  if (state.unsubscribe) {
    try {
      state.unsubscribe();
    } catch (error) {
      console.error('[ListenerState] Error during unsubscribe:', error);
    }
  }
  state.initialized = false;
  state.refCount = 0;
  state.initializationInProgress = false;
  state.anonymousSignInInProgress = false;
  state.cleanupInProgress = false;
  state.unsubscribe = null;
}
