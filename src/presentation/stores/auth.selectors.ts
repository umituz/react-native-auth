/**
 * Auth Store Selectors
 * Pure functions for deriving state from auth store
 */

import type { AuthState, AuthActions, UserType } from "../../types/auth-store.types";
import type { AuthUser } from "../../domain/entities/AuthUser";

// Combined store type for selectors
type AuthStore = AuthState & AuthActions;

// =============================================================================
// STATE SELECTORS
// =============================================================================

/**
 * Select current user
 */
export const selectUser = (state: AuthStore): AuthUser | null => state.user;

/**
 * Select loading state
 */
export const selectLoading = (state: AuthStore): boolean => state.loading;

/**
 * Select anonymous mode (state flag)
 */
export const selectIsAnonymousState = (state: AuthStore): boolean => state.isAnonymous;

/**
 * Select error
 */
export const selectError = (state: AuthStore): string | null => state.error;

/**
 * Select firebase user uid
 */
export const selectFirebaseUserId = (state: AuthStore): string | null =>
  state.firebaseUser?.uid ?? null;

// =============================================================================
// ACTION SELECTORS
// =============================================================================

/**
 * Select setLoading action
 */
export const selectSetLoading = (state: AuthStore) => state.setLoading;

/**
 * Select setError action
 */
export const selectSetError = (state: AuthStore) => state.setError;

/**
 * Select setIsAnonymous action
 */
export const selectSetIsAnonymous = (state: AuthStore) => state.setIsAnonymous;

/**
 * Select showAuthModal action (from authModalStore)
 */
export type AuthModalMode = "login" | "register";
export const selectShowAuthModal = (state: { showAuthModal: (callback?: () => void | Promise<void>, mode?: AuthModalMode) => void }) =>
  state.showAuthModal;

// =============================================================================
// DERIVED SELECTORS
// =============================================================================

/**
 * Get current user ID
 */
export const selectUserId = (state: AuthStore): string | null => {
  return state.firebaseUser?.uid ?? state.user?.uid ?? null;
};

/**
 * Check if user is authenticated (not anonymous)
 */
export const selectIsAuthenticated = (state: AuthStore): boolean => {
  return !!state.user && !state.isAnonymous && !state.user.isAnonymous;
};

/**
 * Check if user is anonymous
 */
export const selectIsAnonymous = (state: AuthStore): boolean => {
  return state.firebaseUser?.isAnonymous ?? state.user?.isAnonymous ?? false;
};

/**
 * Get current user type
 */
export const selectUserType = (state: AuthStore): UserType => {
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
export const selectIsAuthReady = (state: AuthStore): boolean => {
  return state.initialized && !state.loading;
};
