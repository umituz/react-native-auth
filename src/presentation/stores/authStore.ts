/**
 * Auth Store
 * Centralized auth state management using Zustand with AsyncStorage persistence
 *
 * Single source of truth for auth state across the app.
 * Firebase auth changes are synced via initializeAuthListener().
 *
 * @example
 * ```typescript
 * // Initialize once in app root
 * useEffect(() => {
 *   const unsubscribe = initializeAuthListener();
 *   return unsubscribe;
 * }, []);
 *
 * // Use anywhere
 * const { user, isAuthenticated, signIn, signOut } = useAuthStore();
 * ```
 */

import { createStore } from "@umituz/react-native-storage";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@umituz/react-native-firebase";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { mapToAuthUser } from "../../infrastructure/utils/UserMapper";
import { getAuthService } from "../../infrastructure/services/AuthService";

// =============================================================================
// STATE TYPES
// =============================================================================

interface AuthState {
  /** Mapped AuthUser (null if not authenticated) */
  user: AuthUser | null;
  /** Raw Firebase user reference */
  firebaseUser: User | null;
  /** Loading state during auth operations */
  loading: boolean;
  /** Guest mode (user skipped authentication) */
  isGuest: boolean;
  /** Error message from last auth operation */
  error: string | null;
  /** Whether auth listener has initialized */
  initialized: boolean;
}

interface AuthActions {
  /** Update user from Firebase listener */
  setFirebaseUser: (user: User | null) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set guest mode */
  setIsGuest: (isGuest: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Mark as initialized */
  setInitialized: (initialized: boolean) => void;
  /** Reset to initial state */
  reset: () => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: AuthState = {
  user: null,
  firebaseUser: null,
  loading: true,
  isGuest: false,
  error: null,
  initialized: false,
};

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = createStore<AuthState, AuthActions>({
  name: "auth-store",
  initialState,
  persist: true,
  version: 1,
  partialize: (state) => ({
    // Only persist these fields (not functions, not firebaseUser)
    isGuest: state.isGuest,
    initialized: state.initialized,
  }),
  actions: (set, get) => ({
    setFirebaseUser: (firebaseUser) => {
      const { isGuest } = get();

      let user: AuthUser | null = null;

      if (firebaseUser) {
        // Non-anonymous users always get mapped
        if (!firebaseUser.isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        }
        // Anonymous users only if not in guest mode
        else if (!isGuest) {
          user = mapToAuthUser(firebaseUser);
        }
      }

      set({
        firebaseUser,
        user,
        loading: false,
      });
    },

    setLoading: (loading) => set({ loading }),

    setIsGuest: (isGuest) => {
      const { firebaseUser } = get();

      // Recalculate user when guest mode changes
      let user: AuthUser | null = null;
      if (firebaseUser) {
        if (!firebaseUser.isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        } else if (!isGuest) {
          user = mapToAuthUser(firebaseUser);
        }
      }

      set({ isGuest, user });
    },

    setError: (error) => set({ error }),

    setInitialized: (initialized) => set({ initialized }),

    reset: () => set(initialState),
  }),
});

// =============================================================================
// SELECTORS
// =============================================================================

/**
 * Check if user is authenticated (not guest, not anonymous)
 */
export const selectIsAuthenticated = (state: AuthState): boolean => {
  return !!state.user && !state.isGuest && !state.user.isAnonymous;
};

// =============================================================================
// LISTENER
// =============================================================================

let listenerInitialized = false;

/**
 * Initialize Firebase auth listener
 * Call once in app root, returns unsubscribe function
 *
 * @example
 * ```typescript
 * useEffect(() => {
 *   const unsubscribe = initializeAuthListener();
 *   return unsubscribe;
 * }, []);
 * ```
 */
export function initializeAuthListener(): () => void {
  // Prevent multiple initializations
  if (listenerInitialized) {
    return () => {};
  }

  const auth = getFirebaseAuth();
  const store = useAuthStore.getState();

  if (!auth) {
    store.setLoading(false);
    store.setInitialized(true);
    return () => {};
  }

  // Sync initial guest mode from service
  const service = getAuthService();
  if (service) {
    const isGuest = service.getIsGuestMode();
    if (isGuest) {
      store.setIsGuest(true);
    }
  }

  listenerInitialized = true;

  // Subscribe to auth state changes
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (__DEV__) {
      console.log("[authStore] Auth state changed:", user?.uid ?? "null");
    }

    store.setFirebaseUser(user);
    store.setInitialized(true);

    // Reset guest mode when real user signs in
    if (user && !user.isAnonymous && store.isGuest) {
      store.setIsGuest(false);
    }
  });

  return () => {
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
