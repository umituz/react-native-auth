/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 */

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { deleteCurrentUser } from "@umituz/react-native-firebase";

declare const __DEV__: boolean;

export interface UseAccountManagementOptions {
  /**
   * Callback invoked when reauthentication is required (for Google/Apple)
   * Should return Google ID token or null if cancelled
   */
  onReauthRequired?: () => Promise<string | null>;
  /**
   * Callback invoked when password reauthentication is required
   * Required for password-based accounts
   */
  onPasswordRequired?: () => Promise<string | null>;
}

export interface UseAccountManagementReturn {
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
  isDeletingAccount: boolean;
}

export const useAccountManagement = (
  options: UseAccountManagementOptions = {}
): UseAccountManagementReturn => {
  const { user, loading, signOut } = useAuth();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const { onReauthRequired, onPasswordRequired } = options;

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const deleteAccount = useCallback(async () => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[useAccountManagement] deleteAccount called, user:", user);
    }

    if (!user) {
      throw new Error("No user logged in");
    }

    if (user.isAnonymous) {
      throw new Error("Cannot delete anonymous account");
    }

    setIsDeletingAccount(true);

    try {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[useAccountManagement] Calling deleteCurrentUser with options:", {
          autoReauthenticate: true,
          hasOnPasswordRequired: !!onPasswordRequired,
          hasOnReauthRequired: !!onReauthRequired,
        });
      }

      const result = await deleteCurrentUser({
        autoReauthenticate: true,
        onPasswordRequired,
        onGoogleReauthRequired: onReauthRequired,
      });

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[useAccountManagement] deleteCurrentUser result:", result);
      }

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to delete account");
      }
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user, onPasswordRequired, onReauthRequired]);

  return {
    logout,
    deleteAccount,
    isLoading: loading,
    isDeletingAccount,
  };
};
