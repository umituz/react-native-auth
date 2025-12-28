/**
 * Auth Store Selectors
 * Pure functions for deriving state from auth store
 */

import type { AuthState, UserType } from "../../types/auth-store.types";

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
