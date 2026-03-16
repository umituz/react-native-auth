/**
 * Auth State Calculator
 * Pure utility functions for deriving auth state from Firebase user
 * These calculations are used in selectors and can be tested independently
 */

import type { AuthUser } from "../../../domain/entities/AuthUser";
import type { UserType } from "../../../types/auth-store.types";

interface FirebaseUserLike {
  uid: string;
  isAnonymous: boolean;
}

interface AuthStateInput {
  firebaseUser: FirebaseUserLike | null;
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

/**
 * Calculate user ID from Firebase user
 */
export function calculateUserId(firebaseUser: FirebaseUserLike | null): string | null {
  return firebaseUser?.uid ?? null;
}

/**
 * Calculate if user has Firebase account
 */
export function calculateHasFirebaseUser(firebaseUser: FirebaseUserLike | null): boolean {
  return !!firebaseUser;
}

/**
 * Calculate if user is anonymous
 */
export function calculateIsAnonymous(firebaseUser: FirebaseUserLike | null): boolean {
  return firebaseUser?.isAnonymous ?? false;
}

/**
 * Calculate if user is authenticated (has Firebase user, not anonymous)
 */
export function calculateIsAuthenticated(firebaseUser: FirebaseUserLike | null): boolean {
  const hasFirebaseUser = !!firebaseUser;
  const isNotAnonymous = !firebaseUser?.isAnonymous;
  return hasFirebaseUser && isNotAnonymous;
}

/**
 * Calculate user type from Firebase user
 */
export function calculateUserType(firebaseUser: FirebaseUserLike | null): UserType {
  if (!firebaseUser) {
    return "none";
  }
  return firebaseUser.isAnonymous ? "anonymous" : "authenticated";
}

/**
 * Calculate if auth is ready (initialized and not loading)
 */
export function calculateIsAuthReady(initialized: boolean, loading: boolean): boolean {
  return initialized && !loading;
}

/**
 * Calculate all derived auth state at once
 * More efficient than calling individual functions multiple times
 */
export function calculateDerivedAuthState(input: AuthStateInput): {
  userId: string | null;
  hasFirebaseUser: boolean;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  userType: UserType;
  isAuthReady: boolean;
} {
  const { firebaseUser, initialized, loading } = input;

  return {
    userId: calculateUserId(firebaseUser),
    hasFirebaseUser: calculateHasFirebaseUser(firebaseUser),
    isAnonymous: calculateIsAnonymous(firebaseUser),
    isAuthenticated: calculateIsAuthenticated(firebaseUser),
    userType: calculateUserType(firebaseUser),
    isAuthReady: calculateIsAuthReady(initialized, loading),
  };
}
