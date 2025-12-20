/**
 * useProfileUpdate Hook
 * Hook for profile updates - implementation should be provided by app
 * Apps should use Firebase SDK directly or backend API
 */

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import type { UpdateProfileParams } from "../../domain/entities/UserProfile";

export interface UseProfileUpdateReturn {
    updateProfile: (params: UpdateProfileParams) => Promise<void>;
    isUpdating: boolean;
    error: string | null;
}

export const useProfileUpdate = (): UseProfileUpdateReturn => {
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = useCallback(
        async (params: UpdateProfileParams) => {
            if (!user) {
                throw new Error("No user logged in");
            }

            if (user.isAnonymous) {
                throw new Error("Anonymous users cannot update profile");
            }

            // Note: App should implement this via Firebase SDK
            // Example: auth().currentUser?.updateProfile({ displayName, photoURL })
            throw new Error("Profile update should be implemented by app");
        },
        [user],
    );

    return {
        updateProfile,
        isUpdating,
        error,
    };
};
