/**
 * Auth Store
 * Centralized auth state management using Zustand with persistence
 *
 * Single source of truth for auth state across the app.
 * Firebase auth changes are synced via initializeAuthListener().
 */

import { createStore } from "@umituz/react-native-storage";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { mapToAuthUser } from "../../infrastructure/utils/UserMapper";
import type { AuthState, AuthActions, UserType } from "../../types/auth-store.types";
import { initialAuthState } from "../../types/auth-store.types";
import {
  selectUserId,
  selectIsAuthenticated,
  selectIsAnonymous,
  selectUserType,
  selectIsAuthReady,
} from "./auth.selectors";

// Re-export types for convenience
export type { AuthState, AuthActions, UserType };

// Re-export selectors
export {
  selectUserId,
  selectIsAuthenticated,
  selectIsAnonymous,
  selectUserType,
  selectIsAuthReady,
};

// Re-export listener functions
export {
  initializeAuthListener,
  resetAuthListener,
  isAuthListenerInitialized,
} from "./initializeAuthListener";

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = createStore<AuthState, AuthActions>({
  name: "auth-store",
  initialState: initialAuthState,
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

    reset: () => set(initialAuthState),
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
