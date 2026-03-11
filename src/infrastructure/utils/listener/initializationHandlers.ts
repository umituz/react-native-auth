/**
 * Initialization Handlers
 * Helper functions for listener initialization
 */

import type { AuthActions } from "../../../types/auth-store.types";
import { completeInitialization } from "./listenerState.util";

/**
 * Handle case where Firebase auth is not available
 */
export function handleNoFirebaseAuth(store: AuthActions): () => void {
  completeInitialization();
  store.setLoading(false);
  store.setInitialized(true);
  return () => {};
}

/**
 * Complete listener setup and mark as initialized
 */
export function completeListenerSetup(): void {
  completeInitialization();
}
