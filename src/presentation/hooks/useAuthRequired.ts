/**
 * useAuthRequired Hook
 * Check if user meets auth requirements for a feature
 *
 * Usage:
 * ```tsx
 * const { isAllowed, requireAuth } = useAuthRequired();
 *
 * const handleAction = () => {
 *   if (!isAllowed) {
 *     requireAuth(); // Opens auth modal
 *     return;
 *   }
 *   // Proceed with action
 * };
 * ```
 */

import { useCallback } from "react";
import { useAuthStore, selectIsAuthenticated, selectLoading, selectFirebaseUserId } from "../stores/authStore";
import { useAuthModalStore } from "../stores/authModalStore";
import { selectShowAuthModal } from "../stores/auth.selectors";

export interface UseAuthRequiredResult {
  /** Whether user is authenticated (not guest, not anonymous) */
  isAllowed: boolean;
  /** Whether auth is still loading */
  isLoading: boolean;
  /** Current user ID (null if not authenticated) */
  userId: string | null;
  /** Show auth modal to require authentication */
  requireAuth: () => void;
  /** Check and require auth - returns true if allowed, false if modal shown */
  checkAndRequireAuth: () => boolean;
}

/**
 * Hook to check auth requirements and show modal if needed
 */
export function useAuthRequired(): UseAuthRequiredResult {
  const isAllowed = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectLoading);
  const userId = useAuthStore(selectFirebaseUserId);
  const showAuthModal = useAuthModalStore(selectShowAuthModal);

  const requireAuth = useCallback(() => {
    showAuthModal(undefined, "login");
  }, [showAuthModal]);

  const checkAndRequireAuth = useCallback((): boolean => {
    if (isLoading) {
      return false;
    }

    if (!isAllowed) {
      showAuthModal(undefined, "login");
      return false;
    }

    return true;
  }, [isAllowed, isLoading, showAuthModal]);

  return {
    isAllowed,
    isLoading,
    userId,
    requireAuth,
    checkAndRequireAuth,
  };
}
