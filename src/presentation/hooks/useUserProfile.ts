/**
 * useUserProfile Hook
 * Returns profile data for display in settings or profile screens
 * Uses userProfileCalculator utility for calculation logic
 */

import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { calculateUserProfileDisplay } from "../../infrastructure/utils/calculators/userProfileCalculator";

export interface UserProfileData {
  displayName?: string;
  userId?: string;
  isAnonymous: boolean;
  avatarUrl?: string;
  accountSettingsRoute?: string;
  benefits?: string[];
}

export interface UseUserProfileParams {
  anonymousDisplayName?: string;
  accountRoute?: string;
}

export const useUserProfile = (
  params?: UseUserProfileParams,
): UserProfileData | undefined => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return undefined;

    // Delegate to utility function
    return calculateUserProfileDisplay(user, params);
  }, [user, params]);
};
