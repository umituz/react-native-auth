/**
 * Auth Store
 * Centralized auth state management using Zustand with AsyncStorage persistence
 *
 * Single source of truth for auth state across the app.
 * Firebase auth changes are synced via initializeAuthListener().
 */

import { createStore } from "@umituz/react-native-storage";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@umituz/react-native-firebase";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { mapToAuthUser } from "../../infrastructure/utils/UserMapper";
import { getAuthService } from "../../infrastructure/services/AuthService";

declare const __DEV__: boolean;

/**
 * User type classification
 */
export type UserType = "authenticated" | "anonymous" | "none";

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
    isGuest: state.isGuest,
    initialized: state.initialized,
  }),
  actions: (set, get) => ({
    setFirebaseUser: (firebaseUser) => {
      const { isGuest } = get();

      let user: AuthUser | null = null;

      if (firebaseUser) {
        if (!firebaseUser.isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        } else if (!isGuest) {
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
 * Get current user ID
 */
export const selectUserId = (state: AuthState): string | null => {
  return state.firebaseUser?.uid ?? state.user?.uid ?? null;
};

/**
 * Check if user is authenticated (not guest, not anonymous)
 */
export const selectIsAuthenticated = (state: AuthState): boolean => {
  return !!state.user && !state.isGuest && !state.user.isAnonymous;
};

/**
 * Check if user is anonymous
 */
export const selectIsAnonymous = (state: AuthState): boolean => {
  return state.firebaseUser?.isAnonymous ?? state.user?.isAnonymous ?? false;
};

/**
 * Get current user type
 */
export const selectUserType = (state: AuthState): UserType => {
  if (!state.firebaseUser && !state.user) {
    return "none";
  }

  const isAnonymous =
    state.firebaseUser?.isAnonymous ?? state.user?.isAnonymous ?? false;

  return isAnonymous ? "anonymous" : "authenticated";
};

/**
 * Check if auth is ready (initialized and not loading)
 */
export const selectIsAuthReady = (state: AuthState): boolean => {
  return state.initialized && !state.loading;
};

// =============================================================================
// NON-HOOK GETTERS
// =============================================================================

/**
 * Get user ID without hook
 */
export function getUserId(): string | null {
  return selectUserId(useAuthStore.getState());
}

/**
 * Get user type without hook
 */
export function getUserType(): UserType {
  return selectUserType(useAuthStore.getState());
}

/**
 * Check if authenticated without hook
 */
export function getIsAuthenticated(): boolean {
  return selectIsAuthenticated(useAuthStore.getState());
}

/**
 * Check if guest without hook
 */
export function getIsGuest(): boolean {
  return useAuthStore.getState().isGuest;
}

/**
 * Check if anonymous without hook
 */
export function getIsAnonymous(): boolean {
  return selectIsAnonymous(useAuthStore.getState());
}

// =============================================================================
// LISTENER
// =============================================================================

let listenerInitialized = false;

/**
 * Initialize Firebase auth listener
 * Call once in app root, returns unsubscribe function
 */
export function initializeAuthListener(): () => void {
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

  const service = getAuthService();
  if (service) {
    const isGuest = service.getIsGuestMode();
    if (isGuest) {
      store.setIsGuest(true);
    }
  }

  listenerInitialized = true;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.log("[authStore] Auth state changed:", user?.uid ?? "null");
    }

    store.setFirebaseUser(user);
    store.setInitialized(true);

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
