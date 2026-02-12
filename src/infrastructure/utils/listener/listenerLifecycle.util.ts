/**
 * Auth Listener Lifecycle - Main Export
 * Re-exports all listener lifecycle utilities from modular files
 */

// Cleanup handlers
export {
  createUnsubscribeHandler,
  handleExistingInitialization,
  handleInitializationInProgress,
} from "./cleanupHandlers";

// Setup listener
export { setupAuthListener } from "./setupListener";

// Auth state handler
export { handleAuthStateChange } from "./authStateHandler";

// Anonymous mode handler
export { handleAnonymousMode } from "./anonymousHandler";

// Initialization handlers
export {
  handleNoFirebaseAuth,
  completeListenerSetup,
} from "./initializationHandlers";
