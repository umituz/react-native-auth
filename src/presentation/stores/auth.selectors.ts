/**
 * Auth Store Selectors
 * Pure functions for deriving state from auth store
 * Uses authStateCalculator for derived state calculations
 */

import type { AuthState, AuthActions, UserType } from "../../types/auth-store.types";
import type { AuthUser } from "../../domain/entities/AuthUser";
import {
  calculateUserId,
  calculateHasFirebaseUser,
  calculateIsAnonymous,
  calculateIsAuthenticated,
  calculateUserType,
  calculateIsAuthReady,
  calculateDerivedAuthState,
} from "../../infrastructure/utils/calculators/authStateCalculator";

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
// Note: These selectors delegate to authStateCalculator utilities
// for better separation of concerns and testability

/**
 * Get current user ID
 * Uses firebaseUser as single source of truth
 */
export const selectUserId = (state: AuthStore): string | null => {
  return calculateUserId(state.firebaseUser);
};

/**
 * Check if user is authenticated (has a valid Firebase user, not anonymous)
 * Uses firebaseUser as single source of truth
 */
export const selectIsAuthenticated = (state: AuthStore): boolean => {
  return calculateIsAuthenticated(state.firebaseUser);
};

export const selectHasFirebaseUser = (state: AuthStore): boolean => {
  return calculateHasFirebaseUser(state.firebaseUser);
};

/**
 * Check if user is anonymous
 * Uses firebaseUser as single source of truth
 */
export const selectIsAnonymous = (state: AuthStore): boolean => {
  return calculateIsAnonymous(state.firebaseUser);
};

/**
 * Get current user type
 * Derived from firebaseUser state
 */
export const selectUserType = (state: AuthStore): UserType => {
  return calculateUserType(state.firebaseUser);
};

/**
 * Check if auth is ready (initialized and not loading)
 */
export const selectIsAuthReady = (state: AuthStore): boolean => {
  return calculateIsAuthReady(state.initialized, state.loading);
};

/**
 * Batch selector - get all auth state at once to minimize re-renders
 * More efficient than calling selectors individually
 */
export const selectAuthState = (state: AuthStore): {
  user: AuthUser | null;
  userId: string | null;
  userType: UserType;
  loading: boolean;
  isAuthReady: boolean;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  hasFirebaseUser: boolean;
  error: string | null;
} => {
  // Use calculateDerivedAuthState for batch calculation efficiency
  const derivedState = calculateDerivedAuthState({
    firebaseUser: state.firebaseUser,
    user: state.user,
    loading: state.loading,
    initialized: state.initialized,
    error: state.error,
  });

  return {
    user: selectUser(state),
    loading: selectLoading(state),
    error: selectError(state),
    ...derivedState,
  };
};

