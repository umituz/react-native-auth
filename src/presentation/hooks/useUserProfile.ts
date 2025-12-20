/**
 * useUserProfile Hook
 * Generic hook for user profile configuration
 * Returns profile data for display in settings or profile screens
 */

import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { generateGuestName, type GuestNameConfig } from "../../domain/utils/guestNameGenerator";

export interface UserProfileData {
    displayName: string;
    userId?: string;
    isAnonymous: boolean;
    avatarUrl?: string;
    accountSettingsRoute?: string;
}

export interface UseUserProfileParams {
    guestDisplayName?: string;
    accountRoute?: string;
    guestNameConfig?: GuestNameConfig;
}

export const useUserProfile = (
    params?: UseUserProfileParams,
): UserProfileData | undefined => {
    const { user } = useAuth();

    const guestName = params?.guestDisplayName || "Guest";
    const accountRoute = params?.accountRoute || "Account";
    const nameConfig = params?.guestNameConfig;

    return useMemo(() => {
        if (!user) {
            return undefined;
        }

        const isAnonymous = user.isAnonymous || false;

        if (isAnonymous) {
            return {
                displayName: generateGuestName(user.uid, nameConfig),
                userId: user.uid,
                isAnonymous: true,
            };
        }

        return {
            accountSettingsRoute: accountRoute,
            displayName: user.displayName || user.email || guestName,
            userId: user.uid,
            isAnonymous: false,
            avatarUrl: user.photoURL || undefined,
        };
    }, [user, guestName, accountRoute, nameConfig]);
};
