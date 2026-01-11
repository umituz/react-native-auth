/**
 * Auth Listener Initialization
 * Sets up Firebase auth token listener with optional auto anonymous sign-in
 * Uses onIdTokenChanged for profile updates (displayName, email)
 */

import { onIdTokenChanged } from "firebase/auth";
import {
  getFirebaseAuth,
  anonymousAuthService,
} from "@umituz/react-native-firebase";
import { useAuthStore } from "./authStore";
import { getAuthService } from "../../infrastructure/services/AuthService";
import type { AuthListenerOptions } from "../../types/auth-store.types";

declare const __DEV__: boolean;

let listenerInitialized = false;

/**
 * Initialize Firebase auth listener
 * Call once in app root, returns unsubscribe function
 */
export function initializeAuthListener(
  options: AuthListenerOptions = {}
): () => void {
  const { autoAnonymousSignIn = true, onAuthStateChange } = options;

  if (__DEV__) {
    console.log("[AuthListener] initializeAuthListener called:", {
      autoAnonymousSignIn,
      alreadyInitialized: listenerInitialized,
    });
  }

  if (listenerInitialized) {
    if (__DEV__) {
      console.log("[AuthListener] Already initialized, skipping");
    }
    return () => {};
  }

  const auth = getFirebaseAuth();
  const store = useAuthStore.getState();

  if (!auth) {
    if (__DEV__) {
      console.log("[AuthListener] No Firebase auth, marking initialized");
    }
    store.setLoading(false);
    store.setInitialized(true);
    return () => {};
  }

  const service = getAuthService();
  if (service) {
    const isAnonymous = service.getIsAnonymousMode();
    if (__DEV__) {
      console.log("[AuthListener] Service isAnonymousMode:", isAnonymous);
    }
    if (isAnonymous) {
      store.setIsAnonymous(true);
    }
  }

  listenerInitialized = true;

  const unsubscribe = onIdTokenChanged(auth, (user) => {
    if (__DEV__) {
      console.log("[AuthListener] onIdTokenChanged:", {
        uid: user?.uid ?? null,
        isAnonymous: user?.isAnonymous ?? null,
        email: user?.email ?? null,
        displayName: user?.displayName ?? null,
      });
    }

    if (!user && autoAnonymousSignIn) {
      if (__DEV__) {
        console.log("[AuthListener] No user, auto signing in anonymously...");
      }
      void (async () => {
        try {
          await anonymousAuthService.signInAnonymously(auth);
          if (__DEV__) {
            console.log("[AuthListener] Anonymous sign-in successful");
          }
        } catch (error) {
          if (__DEV__) {
            console.warn("[AuthListener] Anonymous sign-in failed:", error);
          }
          store.setFirebaseUser(null);
          store.setInitialized(true);
        }
      })();
      return;
    }

    store.setFirebaseUser(user);
    store.setInitialized(true);

    if (user && !user.isAnonymous && store.isAnonymous) {
      if (__DEV__) {
        console.log("[AuthListener] User converted from anonymous, updating");
      }
      store.setIsAnonymous(false);
    }

    onAuthStateChange?.(user);
  });

  return () => {
    if (__DEV__) {
      console.log("[AuthListener] Unsubscribing");
    }
    unsubscribe();
    listenerInitialized = false;
  };
}

/**
 * Reset listener state (for testing)
 */
export function resetAuthListener(): void {
  listenerInitialized = false;
}

/**
 * Check if listener is initialized
 */
export function isAuthListenerInitialized(): boolean {
  return listenerInitialized;
}
