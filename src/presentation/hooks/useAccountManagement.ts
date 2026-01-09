/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 */

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./useAuth";
import { handleAccountDeletion } from "../utils/accountDeleteHandler.util";

export interface UseAccountManagementOptions {
  /**
   * Callback invoked when reauthentication is required (for Google/Apple)
   */
  onReauthRequired?: () => Promise<boolean>;
  /**
   * Callback invoked when password reauthentication is required
   * If not provided, built-in Alert.prompt will be used
   */
  onPasswordRequired?: () => Promise<string | null>;
  /**
   * Translations for built-in password prompt
   */
  passwordPromptTitle?: string;
  passwordPromptMessage?: string;
  passwordPromptCancel?: string;
  passwordPromptConfirm?: string;
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

  const {
    onReauthRequired,
    onPasswordRequired,
    passwordPromptTitle = "Password Required",
    passwordPromptMessage = "Enter your password to delete account",
    passwordPromptCancel = "Cancel",
    passwordPromptConfirm = "Confirm",
  } = options;

  const defaultPasswordPrompt = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      Alert.prompt(
        passwordPromptTitle,
        passwordPromptMessage,
        [
          { text: passwordPromptCancel, style: "cancel", onPress: () => resolve(null) },
          { text: passwordPromptConfirm, onPress: (pwd?: string) => resolve(pwd || null) },
        ],
        "secure-text"
      );
    });
  }, [passwordPromptTitle, passwordPromptMessage, passwordPromptCancel, passwordPromptConfirm]);

  const passwordHandler = onPasswordRequired || defaultPasswordPrompt;

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
      await handleAccountDeletion({
        onReauthRequired,
        onPasswordRequired: passwordHandler,
      });
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user, onReauthRequired, passwordHandler]);

  return {
    logout,
    deleteAccount,
    isLoading: loading,
    isDeletingAccount,
  };
};
