/**
 * Auth Listener Lifecycle - Main Export
 * Exports all listener lifecycle utilities from modular files
 */

// Cleanup handlers
export {
  handleExistingInitialization,
  handleInitializationInProgress,
} from "./cleanupHandlers";

// Setup listener
export { setupAuthListener } from "./setupListener";

// Initialization handlers
export {
  handleNoFirebaseAuth,
  completeListenerSetup,
} from "./initializationHandlers";
