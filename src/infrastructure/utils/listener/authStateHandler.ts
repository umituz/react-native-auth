/**
 * Auth State Change Handler
 * Processes Firebase auth state changes and updates store
 */

import type { Auth, User } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { completeInitialization } from "./listenerState.util";
import { handleAnonymousMode } from "./anonymousHandler";
import {
  createOrUpdateUserDocument,
  getFirestoreInstance,
} from "../../repositories/UserDocumentRepository";

type Store = AuthActions & { isAnonymous: boolean };

/**
 * Handle auth state change from Firebase
 */
export function handleAuthStateChange(
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
      createOrUpdateUserDocument(getFirestoreInstance(), user).catch((error) => {
        console.error("[AuthListener] Failed to create/update user document:", error);
        // Don't throw - Firestore failures shouldn't block auth state updates
      });
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
