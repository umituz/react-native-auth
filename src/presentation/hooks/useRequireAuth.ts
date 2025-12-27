/**
 * useRequireAuth Hook
 * Returns userId, throws if not authenticated
 *
 * Usage:
 * ```tsx
 * // In a component that MUST have authenticated user
 * const userId = useRequireAuth();
 * // userId is guaranteed to be string, not null
 * ```
 */

import { useAuthStore, selectIsAuthenticated } from "../stores/authStore";

/**
 * Get userId or throw if not authenticated
 * Use this in components that REQUIRE authentication
 */
export function useRequireAuth(): string {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userId = useAuthStore((state) => state.firebaseUser?.uid ?? null);

  if (!isAuthenticated || !userId) {
    throw new Error("User not authenticated. This component requires auth.");
  }

  return userId;
}

/**
 * Get userId safely (returns null if not authenticated)
 */
export function useUserId(): string | null {
  return useAuthStore((state) => state.firebaseUser?.uid ?? null);
}
