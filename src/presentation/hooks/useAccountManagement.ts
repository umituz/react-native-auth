/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 */

import { useCallback } from "react";
import { useAuth } from "./useAuth";

export interface UseAccountManagementReturn {
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    isLoading: boolean;
}

export const useAccountManagement = (): UseAccountManagementReturn => {
    const { user, loading, signOut } = useAuth();

    const logout = useCallback(async () => {
        await signOut();
    }, [signOut]);

    const deleteAccount = useCallback(async () => {
        if (!user) {
            throw new Error("No user logged in");
        }

        if (user.isAnonymous) {
            throw new Error("Cannot delete anonymous account");
        }

        // Note: Add user deletion logic via Firebase Admin SDK on backend
        // Frontend should call backend API to delete user account
        throw new Error("Account deletion requires backend implementation");
    }, [user]);

    return {
        logout,
        deleteAccount,
        isLoading: loading,
    };
};
