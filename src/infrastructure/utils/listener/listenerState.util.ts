/**
 * Auth Listener State Management
 * Manages the state of Firebase auth listener initialization and lifecycle
 */

export interface ListenerState {
  initialized: boolean;
  refCount: number;
  initializationInProgress: boolean;
  anonymousSignInInProgress: boolean;
  unsubscribe: (() => void) | null;
}

const state: ListenerState = {
  initialized: false,
  refCount: 0,
  initializationInProgress: false,
  anonymousSignInInProgress: false,
  unsubscribe: null,
};

/**
 * Check if listener is initialized
 */
export function isListenerInitialized(): boolean {
  return state.initialized;
}

/**
 * Check if initialization is in progress
 */
export function isInitializationInProgress(): boolean {
  return state.initializationInProgress;
}

/**
 * Check if anonymous sign-in is in progress
 */
export function isAnonymousSignInInProgress(): boolean {
  return state.anonymousSignInInProgress;
}

/**
 * Get current reference count
 */
export function getRefCount(): number {
  return state.refCount;
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
 */
export function completeInitialization(): void {
  state.initializationInProgress = false;
  state.initialized = true;
  state.refCount = 1;
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
 */
export function decrementRefCount(): { shouldCleanup: boolean; count: number } {
  state.refCount--;
  const shouldCleanup = state.refCount <= 0 && state.unsubscribe !== null;
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
 * Reset all state (for testing)
 */
export function resetListenerState(): void {
  if (state.unsubscribe) {
    state.unsubscribe();
  }
  state.initialized = false;
  state.refCount = 0;
  state.initializationInProgress = false;
  state.anonymousSignInInProgress = false;
  state.unsubscribe = null;
}
