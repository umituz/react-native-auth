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

const MAX_ANONYMOUS_RETRIES = 2;
const ANONYMOUS_RETRY_DELAY_MS = 1000;

let listenerInitialized = false;
// Reference counter for multiple subscribers
let listenerRefCount = 0;
// Actual unsubscribe function from Firebase
let firebaseUnsubscribe: (() => void) | null = null;

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

  // If already initialized, increment ref count and return unsubscribe that decrements
  if (listenerInitialized) {
    listenerRefCount++;
    if (__DEV__) {
      console.log("[AuthListener] Already initialized, incrementing ref count:", listenerRefCount);
    }
    // Return function that decrements ref count
    return () => {
      listenerRefCount--;
      if (__DEV__) {
        console.log("[AuthListener] Ref count decremented:", listenerRefCount);
      }
      // Only cleanup when all subscribers unsubscribe
      if (listenerRefCount <= 0 && firebaseUnsubscribe) {
        if (__DEV__) {
          console.log("[AuthListener] Last subscriber, cleaning up");
        }
        firebaseUnsubscribe();
        firebaseUnsubscribe = null;
        listenerInitialized = false;
        listenerRefCount = 0;
      }
    };
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
  listenerRefCount = 1;

  firebaseUnsubscribe = onIdTokenChanged(auth, (user) => {
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
      // Set loading state while attempting sign-in
      store.setLoading(true);

      void (async () => {
        for (let attempt = 0; attempt <= MAX_ANONYMOUS_RETRIES; attempt++) {
          try {
            await anonymousAuthService.signInAnonymously(auth);
            if (__DEV__) {
              console.log("[AuthListener] Anonymous sign-in successful");
            }
            // Success - the listener will fire again with the new user
            return;
          } catch (error) {
            if (__DEV__) {
              console.warn(`[AuthListener] Anonymous sign-in attempt ${attempt + 1} failed:`, error);
            }

            // If not last attempt, wait and retry
            if (attempt < MAX_ANONYMOUS_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, ANONYMOUS_RETRY_DELAY_MS));
              continue;
            }

            // Last attempt failed - set error state
            if (__DEV__) {
              console.error("[AuthListener] All anonymous sign-in attempts failed");
            }
            store.setFirebaseUser(null);
            store.setLoading(false);
            store.setInitialized(true);
          }
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
    listenerRefCount--;
    if (__DEV__) {
      console.log("[AuthListener] Unsubscribing, ref count:", listenerRefCount);
    }
    // Only cleanup when all subscribers unsubscribe
    if (listenerRefCount <= 0 && firebaseUnsubscribe) {
      if (__DEV__) {
        console.log("[AuthListener] Last subscriber, cleaning up listener");
      }
      firebaseUnsubscribe();
      firebaseUnsubscribe = null;
      listenerInitialized = false;
      listenerRefCount = 0;
    }
  };
}

/**
 * Reset listener state (for testing)
 */
export function resetAuthListener(): void {
  if (firebaseUnsubscribe) {
    firebaseUnsubscribe();
    firebaseUnsubscribe = null;
  }
  listenerInitialized = false;
  listenerRefCount = 0;
}

/**
 * Check if listener is initialized
 */
export function isAuthListenerInitialized(): boolean {
  return listenerInitialized;
}
