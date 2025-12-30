/**
 * useUserProfile Hook
 * Generic hook for user profile configuration
 * Returns profile data for display in settings or profile screens
 */

import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { generateAnonymousName, type AnonymousNameConfig } from "../../domain/utils/anonymousNameGenerator";

export interface UserProfileData {
    displayName?: string;
    userId?: string;
    isAnonymous: boolean;
    avatarUrl?: string;
    accountSettingsRoute?: string;
}

export interface UseUserProfileParams {
    anonymousDisplayName?: string;
    accountRoute?: string;
    anonymousNameConfig?: AnonymousNameConfig;
}

export const useUserProfile = (
    params?: UseUserProfileParams,
): UserProfileData | undefined => {
    const { user } = useAuth();

    const anonymousName = params?.anonymousDisplayName;
    const accountRoute = params?.accountRoute;
    const nameConfig = params?.anonymousNameConfig;

    return useMemo(() => {
        if (!user) {
            return undefined;
        }

        const isAnonymous = user.isAnonymous || false;

        if (isAnonymous) {
            return {
                displayName: generateAnonymousName(user.uid, nameConfig),
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
    }, [user, anonymousName, accountRoute, nameConfig]);
};
