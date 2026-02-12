/**
 * useAccountManagement Hook
 * Provides account management functionality (logout, delete)
 */

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./useAuth";
import { deleteCurrentUser } from "@umituz/react-native-firebase";

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

  const PASSWORD_PROMPT_TIMEOUT_MS = 300000; // 5 minutes

  const defaultPasswordPrompt = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      let resolved = false;

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null); // Treat timeout as cancellation
        }
      }, PASSWORD_PROMPT_TIMEOUT_MS);

      Alert.prompt(
        passwordPromptTitle,
        passwordPromptMessage,
        [
          {
            text: passwordPromptCancel,
            style: "cancel",
            onPress: () => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                resolve(null);
              }
            }
          },
          {
            text: passwordPromptConfirm,
            onPress: (pwd?: string) => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                resolve(pwd || null);
              }
            }
          },
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

    setIsDeletingAccount(true);

    try {
      // First attempt - Firebase will check if reauthentication is needed
      const result = await deleteCurrentUser({ autoReauthenticate: true });

      if (result.success) {
        return;
      }

      // Handle password reauthentication
      if (result.error?.code === "auth/password-reauth") {
        const password = await passwordHandler();
        if (!password) {
          throw new Error("Password required to delete account");
        }

        // Retry with password
        const retryResult = await deleteCurrentUser({
          autoReauthenticate: true,
          password,
        });

        if (!retryResult.success) {
          throw new Error(retryResult.error?.message || "Failed to delete account");
        }

        return;
      }

      // Handle social auth reauthentication
      if (result.error?.requiresReauth && onReauthRequired) {
        const reauthSuccess = await onReauthRequired();
        if (!reauthSuccess) {
          throw new Error("Reauthentication required to delete account");
        }

        // Retry after social reauth
        const retryResult = await deleteCurrentUser({ autoReauthenticate: true });

        if (!retryResult.success) {
          throw new Error(retryResult.error?.message || "Failed to delete account");
        }

        return;
      }

      // Other errors
      throw new Error(result.error?.message || "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user, passwordHandler, onReauthRequired]);

  return {
    logout,
    deleteAccount,
    isLoading: loading,
    isDeletingAccount,
  };
};
