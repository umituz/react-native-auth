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

import { createStore } from "@umituz/react-native-design-system";
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
      const prevState = get();
      const user = firebaseUser ? mapToAuthUser(firebaseUser) : null;
      const isAnonymous = firebaseUser?.isAnonymous ?? false;

      if (__DEV__) {
        console.log("[AuthStore] setFirebaseUser:", {
          uid: firebaseUser?.uid ?? null,
          isAnonymous,
          prevIsAnonymous: prevState.isAnonymous,
          hasUser: !!user,
        });
      }

      set({ firebaseUser, user, loading: false, isAnonymous });
    },

    setLoading: (loading) => {
      if (__DEV__) {
        console.log("[AuthStore] setLoading:", loading);
      }
      set({ loading });
    },

    setIsAnonymous: (isAnonymous) => {
      const { user } = get();
      if (__DEV__) {
        console.log("[AuthStore] setIsAnonymous:", { isAnonymous, hadUser: !!user });
      }
      // Also update user.isAnonymous when converting from anonymous
      if (user && !isAnonymous && user.isAnonymous) {
        set({ isAnonymous, user: { ...user, isAnonymous: false } });
      } else {
        set({ isAnonymous });
      }
    },

    setError: (error) => {
      if (__DEV__ && error) {
        console.log("[AuthStore] setError:", error);
      }
      set({ error });
    },

    setInitialized: (initialized) => {
      if (__DEV__) {
        console.log("[AuthStore] setInitialized:", initialized);
      }
      set({ initialized });
    },

    reset: () => {
      if (__DEV__) {
        console.log("[AuthStore] reset");
      }
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
