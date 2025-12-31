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
  selectUser,
  selectLoading,
  selectIsAnonymousState,
  selectError,
  selectFirebaseUserId,
  selectSetLoading,
  selectSetError,
  selectSetIsAnonymous,
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
  selectUser,
  selectLoading,
  selectIsAnonymousState,
  selectError,
  selectFirebaseUserId,
  selectSetLoading,
  selectSetError,
  selectSetIsAnonymous,
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
  version: 2,
  partialize: (state) => ({
    isAnonymous: state.isAnonymous,
    initialized: state.initialized,
  }),
  migrate: (persistedState: unknown, version: number) => {
    const state = persistedState as Partial<AuthState>;
    if (version < 2) {
      return {
        ...initialAuthState,
        isAnonymous: state.isAnonymous ?? false,
        initialized: state.initialized ?? false,
      };
    }
    return { ...initialAuthState, ...state } as AuthState;
  },
  actions: (set, get) => ({
    setFirebaseUser: (firebaseUser) => {
      const { isAnonymous } = get();

      let user: AuthUser | null = null;

      if (firebaseUser) {
        if (!firebaseUser.isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        } else if (!isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        }
      }

      set({
        firebaseUser,
        user,
        loading: false,
        isAnonymous: firebaseUser?.isAnonymous ?? false,
      });
    },

    setLoading: (loading) => set({ loading }),

    setIsAnonymous: (isAnonymous) => {
      const { firebaseUser } = get();

      let user: AuthUser | null = null;
      if (firebaseUser) {
        if (!firebaseUser.isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        } else if (!isAnonymous) {
          user = mapToAuthUser(firebaseUser);
        }
      }

      set({ isAnonymous, user });
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
 * Check if anonymous without hook
 */
export function getIsAnonymous(): boolean {
  return selectIsAnonymous(useAuthStore.getState());
}
