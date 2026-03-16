/**
 * User Profile Calculator Utility
 * Pure utility functions for calculating user profile display data
 * Separates profile calculation logic from hooks for better testability
 */

import type { AuthUser } from "../../../domain/entities/AuthUser";

interface UserProfileDisplayParams {
  anonymousDisplayName?: string;
  accountRoute?: string;
}

interface UserProfileDisplayResult {
  displayName: string;
  userId: string;
  isAnonymous: boolean;
  avatarUrl?: string;
  accountSettingsRoute?: string;
}

/**
 * Calculate user profile display data
 * Handles anonymous vs authenticated user display logic
 */
export function calculateUserProfileDisplay(
  user: AuthUser,
  params: UserProfileDisplayParams = {}
): UserProfileDisplayResult {
  const { anonymousDisplayName = "Anonymous User", accountRoute } = params;

  if (user.isAnonymous) {
    return {
      displayName: anonymousDisplayName,
      userId: user.uid,
      isAnonymous: true,
      accountSettingsRoute: accountRoute,
    };
  }

  return {
    displayName: user.displayName || user.email || anonymousDisplayName,
    userId: user.uid,
    isAnonymous: false,
    avatarUrl: user.photoURL || undefined,
    accountSettingsRoute: accountRoute,
  };
}

/**
 * Get display name for user
 * Extracts display name calculation for reusability
 */
export function calculateDisplayName(
  user: AuthUser,
  anonymousDisplayName: string = "Anonymous User"
): string {
  if (user.isAnonymous) {
    return anonymousDisplayName;
  }

  return user.displayName || user.email || anonymousDisplayName;
}

/**
 * Check if user has avatar
 */
export function hasUserAvatar(user: AuthUser): boolean {
  return !!user.photoURL;
}

/**
 * Get avatar URL if available
 */
export function getAvatarUrl(user: AuthUser): string | undefined {
  return user.photoURL || undefined;
}
