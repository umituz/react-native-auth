/**
 * Auth Listener Initialization
 * Sets up Firebase auth token listener with optional auto anonymous sign-in
 * Uses onIdTokenChanged for profile updates (displayName, email)
 */

import { onIdTokenChanged } from "firebase/auth";
import { getFirebaseAuth } from "@umituz/react-native-firebase";
import { useAuthStore } from "./authStore";
import { getAuthService } from "../../infrastructure/services/AuthService";
import type { AuthListenerOptions } from "../../types/auth-store.types";
import { createAnonymousSignInHandler } from "../../infrastructure/utils/listener/anonymousSignInHandler";

let listenerInitialized = false;
let listenerRefCount = 0;
let firebaseUnsubscribe: (() => void) | null = null;
let anonymousSignInInProgress = false; // Prevent race conditions
let initializationInProgress = false; // Prevent duplicate initialization

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
      initializationInProgress,
    });
  }

  // Prevent duplicate initialization - return existing unsubscribe if already initializing
  if (initializationInProgress) {
    if (__DEV__) {
      console.warn("[AuthListener] Initialization already in progress, returning existing unsubscribe");
    }
    return () => {
      // No-op - will be handled by the initial initialization
    };
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
        anonymousSignInInProgress = false;
      }
    };
  }

  // Mark initialization as in progress
  initializationInProgress = true;

  const auth = getFirebaseAuth();
  const store = useAuthStore.getState();

  if (!auth) {
    if (__DEV__) {
      console.log("[AuthListener] No Firebase auth, marking initialized");
    }
    initializationInProgress = false;
    store.setLoading(false);
    store.setInitialized(true);
    return () => {};
  }

  listenerInitialized = true;
  listenerRefCount = 1;

  // Initialize listener first, then check anonymous mode
  // This prevents race conditions where the listener fires before we set up state
  const service = getAuthService();
  if (service) {
    const isAnonymous = service.getIsAnonymousMode();
    if (__DEV__) {
      console.log("[AuthListener] Service isAnonymousMode:", isAnonymous);
    }
    // Set anonymous mode flag before setting up listener
    // This ensures consistent state when listener first fires
    if (isAnonymous) {
      store.setIsAnonymous(true);
    }
  }

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
      // Prevent race condition: only one anonymous sign-in at a time
      if (anonymousSignInInProgress) {
        if (__DEV__) {
          console.log("[AuthListener] Anonymous sign-in already in progress, skipping");
        }
        store.setFirebaseUser(null);
        return;
      }

      if (__DEV__) {
        console.log("[AuthListener] No user, auto signing in anonymously...");
      }

      anonymousSignInInProgress = true;

      // Create and execute anonymous sign-in handler
      const handleAnonymousSignIn = createAnonymousSignInHandler(auth, store);

      // Start sign-in without blocking the listener
      void (async () => {
        try {
          await handleAnonymousSignIn();
        } finally {
          anonymousSignInInProgress = false;
        }
      })();

      // Continue execution - don't return early
      // The listener will be triggered again when sign-in succeeds
      store.setFirebaseUser(null);
      initializationInProgress = false;
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

  initializationInProgress = false;

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
      anonymousSignInInProgress = false;
      initializationInProgress = false;
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
  anonymousSignInInProgress = false;
  initializationInProgress = false;
}

/**
 * Check if listener is initialized
 */
export function isAuthListenerInitialized(): boolean {
  return listenerInitialized;
}
