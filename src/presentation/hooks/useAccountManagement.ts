/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 * Generic hook - reauthentication is handled via callback from calling app
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { deleteCurrentUser } from "@umituz/react-native-firebase";

export interface UseAccountManagementOptions {
  /**
   * Callback invoked when reauthentication is required
   * App should show appropriate UI (Google/Apple sign-in) and return success status
   * If not provided, reauthentication errors will be thrown
   */
  onReauthRequired?: () => Promise<boolean>;
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
  const { onReauthRequired } = options;

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

    setIsDeletingAccount(true);

    try {
      const result = await deleteCurrentUser({ autoReauthenticate: true });

      if (result.success) {
        return;
      }

      // If reauthentication required and callback provided
      if (result.error?.requiresReauth && onReauthRequired) {
        const reauthSuccess = await onReauthRequired();

        if (reauthSuccess) {
          const retryResult = await deleteCurrentUser({
            autoReauthenticate: false,
          });

          if (retryResult.success) {
            return;
          }

          if (retryResult.error) {
            throw new Error(retryResult.error.message);
          }
        }
      }

      if (result.error) {
        throw new Error(result.error.message);
      }
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user, onReauthRequired]);

  return {
    logout,
    deleteAccount,
    isLoading: loading,
    isDeletingAccount,
  };
};
