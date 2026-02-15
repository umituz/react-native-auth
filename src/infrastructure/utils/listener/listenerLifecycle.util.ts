/**
 * Auth Listener Lifecycle - Main Export
 * Exports all listener lifecycle utilities from modular files
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
export { handleAuthStateChange } from "./authListenerStateHandler";

// Anonymous mode handler
export { handleAnonymousMode } from "./anonymousHandler";

// Initialization handlers
export {
  handleNoFirebaseAuth,
  completeListenerSetup,
} from "./initializationHandlers";
