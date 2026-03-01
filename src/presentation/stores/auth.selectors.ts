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
 * Uses firebaseUser as single source of truth
 */
export const selectUserId = (state: AuthStore): string | null => {
  return state.firebaseUser?.uid ?? null;
};

/**
 * Check if user is authenticated (has a valid Firebase user, not anonymous)
 * Uses firebaseUser as single source of truth
 */
export const selectIsAuthenticated = (state: AuthStore): boolean => {
  const hasFirebaseUser = !!state.firebaseUser;
  const isNotAnonymous = !state.firebaseUser?.isAnonymous;
  return hasFirebaseUser && isNotAnonymous;
};

export const selectHasFirebaseUser = (state: AuthStore): boolean => {
  return !!state.firebaseUser;
};

/**
 * Check if user is anonymous
 * Uses firebaseUser as single source of truth
 */
export const selectIsAnonymous = (state: AuthStore): boolean => {
  return state.firebaseUser?.isAnonymous ?? false;
};

/**
 * Get current user type
 * Derived from firebaseUser state
 */
export const selectUserType = (state: AuthStore): UserType => {
  if (!state.firebaseUser) {
    return "none";
  }

  return state.firebaseUser.isAnonymous ? "anonymous" : "authenticated";
};

/**
 * Check if auth is ready (initialized and not loading)
 */
export const selectIsAuthReady = (state: AuthStore): boolean => {
  return state.initialized && !state.loading;
};

