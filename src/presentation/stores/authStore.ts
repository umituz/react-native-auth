/**
 * Auth Store
 * Centralized auth state management using Zustand with persistence
 *
 * Single source of truth for auth state across the app.
 * Firebase auth changes are synced via initializeAuthListener().
 *
 * IMPORTANT: user is ALWAYS set when firebaseUser exists (anonymous or not).
 * The isAnonymous flag indicates the user type, not whether user is null.
 */

import { createStore, storageService } from "@umituz/react-native-design-system";
import { mapToAuthUser } from "../../infrastructure/utils/UserMapper";
import type { AuthState, AuthActions, UserType } from "../../types/auth-store.types";
import { initialAuthState } from "../../types/auth-store.types";
import {
  selectUserId,
  selectIsAuthenticated,
  selectIsAnonymous,
  selectUserType,
  selectIsRegisteredUser,
} from "./auth.selectors";

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = createStore<AuthState, AuthActions>({
  name: "auth-store",
  initialState: initialAuthState,
  persist: true,
  storage: {
    getItem: (name) => storageService.getItem(name),
    setItem: (name, value) => storageService.setItem(name, value),
    removeItem: (name) => storageService.removeItem(name),
  },
  version: 2,
  partialize: (state) => ({
    isAnonymous: state.isAnonymous,
    initialized: state.initialized,
  }),
  migrate: (persistedState: unknown, version: number) => {
    const state = (persistedState && typeof persistedState === "object" ? persistedState : {}) as Partial<AuthState>;
    if (version < 2) {
      return {
        ...initialAuthState,
        isAnonymous: state.isAnonymous ?? false,
        initialized: state.initialized ?? false,
      };
    }
    return { ...initialAuthState, ...state };
  },
  actions: (set, get) => ({
    setFirebaseUser: (firebaseUser) => {
      const user = firebaseUser ? mapToAuthUser(firebaseUser) : null;
      const isAnonymous = firebaseUser?.isAnonymous ?? false;
      set({ firebaseUser, user, loading: false, isAnonymous });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    setIsAnonymous: (isAnonymous) => {
      const currentState = get();
      // Only update isAnonymous if it's consistent with the firebaseUser state
      // If we have a firebaseUser, isAnonymous should match it
      const currentUserIsAnonymous = currentState.firebaseUser?.isAnonymous ?? false;

      if (currentState.firebaseUser) {
        // We have a firebase user - sync isAnonymous with it
        set({ isAnonymous: currentUserIsAnonymous });
      } else {
        // No firebase user yet, allow setting isAnonymous for anonymous mode preference
        set({ isAnonymous });
      }
    },

    setError: (error) => {
      set({ error });
    },

    setInitialized: (initialized) => {
      set({ initialized });
    },

    reset: () => {
      set(initialAuthState);
    },
  }),
});

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
 * Check if anonymous without hook
 */
export function getIsAnonymous(): boolean {
  return selectIsAnonymous(useAuthStore.getState());
}

/**
 * Check if registered user without hook
 * Returns true only if user is authenticated AND not anonymous
 */
export function getIsRegisteredUser(): boolean {
  return selectIsRegisteredUser(useAuthStore.getState());
}
