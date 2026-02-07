/**
 * useProfileUpdate Hook
 * Hook for profile updates - implementation should be provided by app
 * Apps should use Firebase SDK directly or backend API
 */

import { useCallback } from "react";
import { useAuth } from "./useAuth";
import type { UpdateProfileParams } from "../../domain/entities/UserProfile";

export interface UseProfileUpdateReturn {
    updateProfile: (params: UpdateProfileParams) => Promise<void>;
    isUpdating: boolean;
    error: string | null;
}

export const useProfileUpdate = (): UseProfileUpdateReturn => {
    const { user } = useAuth();

    const updateProfile = useCallback(
        (_params: UpdateProfileParams) => {
            if (!user) {
                return Promise.reject(new Error("No user logged in"));
            }

            if (user.isAnonymous) {
                return Promise.reject(new Error("Anonymous users cannot update profile"));
            }

            // Note: App should implement this via Firebase SDK
            return Promise.reject(new Error("Profile update should be implemented by app"));
        },
        [user],
    );

    return {
        updateProfile,
        isUpdating: false,
        error: null,
    };
};

