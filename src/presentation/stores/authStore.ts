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
import type { AuthState, AuthActions } from "../../types/auth-store.types";
import { initialAuthState } from "../../types/auth-store.types";

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
  migrate: (persistedState: unknown) => {
    const state = (persistedState && typeof persistedState === "object" ? persistedState : {}) as Partial<AuthState>;
    return {
      ...initialAuthState,
      isAnonymous: state.isAnonymous ?? false,
      initialized: state.initialized ?? false,
    };
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
      // When firebaseUser exists, always derive from it to stay consistent
      const resolved = currentState.firebaseUser
        ? currentState.firebaseUser.isAnonymous
        : isAnonymous;
      set({ isAnonymous: resolved });
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

