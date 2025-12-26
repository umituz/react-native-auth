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
      if (__DEV__) {
        console.log("[useAccountManagement] Calling deleteCurrentUser with autoReauthenticate: true");
      }

      const result = await deleteCurrentUser({ autoReauthenticate: true });

      if (__DEV__) {
        console.log("[useAccountManagement] First delete attempt result:", result);
      }

      if (result.success) {
        if (__DEV__) {
          console.log("[useAccountManagement] ✅ Delete successful on first attempt");
        }
        return;
      }

      // If reauthentication required
      if (result.error?.requiresReauth) {
        // Handle password-based reauth
        if (result.error.code === "auth/password-reauth-required" && onPasswordRequired) {
          if (__DEV__) {
            console.log("[useAccountManagement] Password reauth required, prompting user");
          }

          const password = await onPasswordRequired();

          if (password) {
            if (__DEV__) {
              console.log("[useAccountManagement] Password provided, retrying delete");
            }

            const retryResult = await deleteCurrentUser({
              autoReauthenticate: false,
              password,
            });

            if (__DEV__) {
              console.log("[useAccountManagement] Retry delete with password result:", retryResult);
            }

            if (retryResult.success) {
              if (__DEV__) {
                console.log("[useAccountManagement] ✅ Delete successful after password reauth");
              }
              return;
            }

            if (retryResult.error) {
              throw new Error(retryResult.error.message);
            }
          } else {
            if (__DEV__) {
              console.log("[useAccountManagement] Password prompt cancelled");
            }
            throw new Error("Password required to delete account");
          }
        }

        // Handle Google/Apple reauth
        if (onReauthRequired) {
          if (__DEV__) {
            console.log("[useAccountManagement] Reauth required, calling onReauthRequired callback");
          }

          const reauthSuccess = await onReauthRequired();

          if (__DEV__) {
            console.log("[useAccountManagement] onReauthRequired result:", reauthSuccess);
          }

          if (reauthSuccess) {
            if (__DEV__) {
              console.log("[useAccountManagement] Retrying delete after reauth");
            }

            const retryResult = await deleteCurrentUser({
              autoReauthenticate: false,
            });

            if (__DEV__) {
              console.log("[useAccountManagement] Retry delete result:", retryResult);
            }

            if (retryResult.success) {
              if (__DEV__) {
                console.log("[useAccountManagement] ✅ Delete successful after reauth");
              }
              return;
            }

            if (retryResult.error) {
              throw new Error(retryResult.error.message);
            }
          }
        }
      }

      if (result.error) {
        if (__DEV__) {
          console.log("[useAccountManagement] ❌ Delete failed:", result.error);
        }
        throw new Error(result.error.message);
      }
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
