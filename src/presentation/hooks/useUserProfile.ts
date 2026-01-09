/**
 * useUserProfile Hook
 * Returns profile data for display in settings or profile screens
 */

import { useMemo } from "react";
import { useAuth } from "./useAuth";

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
  const anonymousName = params?.anonymousDisplayName ?? "Anonymous User";
  const accountRoute = params?.accountRoute;

  return useMemo(() => {
    if (!user) return undefined;

    const isAnonymous = user.isAnonymous || false;

    if (isAnonymous) {
      return {
        displayName: anonymousName,
        userId: user.uid,
        isAnonymous: true,
        accountSettingsRoute: accountRoute,
      };
    }

    return {
      accountSettingsRoute: accountRoute,
      displayName: user.displayName || user.email || anonymousName,
      userId: user.uid,
      isAnonymous: false,
      avatarUrl: user.photoURL || undefined,
    };
  }, [user, anonymousName, accountRoute]);
};
