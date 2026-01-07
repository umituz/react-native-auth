/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 * Generic hook - reauthentication is handled via callback from calling app
 */

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { handleAccountDeletion } from "../utils/accountDeleteHandler.util";

export interface UseAccountManagementOptions {
  /**
   * Callback invoked when reauthentication is required (for Google/Apple)
   * App should show appropriate UI (Google/Apple sign-in) and return success status
   * If not provided, reauthentication errors will be thrown
   */
  onReauthRequired?: () => Promise<boolean>;
  /**
   * Callback invoked when password reauthentication is required (for email/password accounts)
   * App should show password prompt and return the entered password, or null if cancelled
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
    if (!user) {
      throw new Error("No user logged in");
    }

    if (user.isAnonymous) {
      throw new Error("Cannot delete anonymous account");
    }

    if (__DEV__) {
      console.log("[useAccountManagement] Starting delete account", {
        userId: user.uid,
        provider: user.provider,
      });
    }

    setIsDeletingAccount(true);

    try {
      await handleAccountDeletion({ onReauthRequired, onPasswordRequired });
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user, onReauthRequired, onPasswordRequired]);

  return {
    logout,
    deleteAccount,
    isLoading: loading,
    isDeletingAccount,
  };
};
