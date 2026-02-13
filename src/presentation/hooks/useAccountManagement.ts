/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 */

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { deleteCurrentUser, usePasswordPrompt } from "@umituz/react-native-firebase";

export interface UseAccountManagementOptions {
  /**
   * Callback invoked when reauthentication is required (for Google/Apple)
   * Should return Google ID token or null if cancelled
   */
  onReauthRequired?: () => Promise<string | null>;
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
  PasswordPromptComponent: React.ReactNode;
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

  const { showPasswordPrompt, PasswordPromptComponent } = usePasswordPrompt({
    title: passwordPromptTitle,
    message: passwordPromptMessage,
    cancelText: passwordPromptCancel,
    confirmText: passwordPromptConfirm,
  });

  const passwordHandler = onPasswordRequired || showPasswordPrompt;

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const deleteAccount = useCallback(async () => {
    console.log("[useAccountManagement] deleteAccount called", { user: user?.uid });
    if (!user) {
      throw new Error("No user logged in");
    }

    if (user.isAnonymous) {
      throw new Error("Cannot delete anonymous account");
    }

    setIsDeletingAccount(true);

    try {
      console.log("[useAccountManagement] Calling deleteCurrentUser...");
      const result = await deleteCurrentUser({
        autoReauthenticate: true,
        onPasswordRequired: passwordHandler,
        onGoogleReauthRequired: onReauthRequired,
      });

      console.log("[useAccountManagement] deleteCurrentUser result:", result);

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to delete account");
      }
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user, passwordHandler, onReauthRequired]);

  return {
    logout,
    deleteAccount,
    isLoading: loading,
    isDeletingAccount,
    PasswordPromptComponent,
  };
};
