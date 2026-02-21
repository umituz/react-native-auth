import { useCallback } from "react";
import { Linking, Alert } from "react-native";
import { useAuth } from "./useAuth";
import { useAuthModalStore } from "../stores/authModalStore";
import { useAccountManagement } from "./useAccountManagement";
import { AlertService } from "@umituz/react-native-design-system";
import { usePasswordPromptNavigation } from "./usePasswordPromptNavigation";

export interface AuthHandlersAppInfo {
  appStoreUrl?: string;
}

export interface AuthHandlersTranslations {
  deleteAccountTitle?: string;
  deleteAccountMessage?: string;
  cancel?: string;
  delete?: string;
  common?: string;
  appStoreUrlNotConfigured?: string;
  unableToOpenAppStore?: string;
  failedToOpenAppStore?: string;
  unknown?: string;
  deleteAccountError?: string;
}

export const useAuthHandlers = (appInfo: AuthHandlersAppInfo, translations?: AuthHandlersTranslations) => {
  const { signOut } = useAuth();
  const { showAuthModal } = useAuthModalStore();

  const { showPasswordPrompt } = usePasswordPromptNavigation({
    title: translations?.deleteAccountTitle || "Confirm Account Deletion",
    message: translations?.deleteAccountMessage || "Please enter your password to permanently delete your account. This action cannot be undone.",
    cancelText: translations?.cancel || "Cancel",
    confirmText: translations?.delete || "Delete",
  });

  const { deleteAccount: deleteAccountFromAuth } = useAccountManagement({
    onPasswordRequired: showPasswordPrompt,
  });

  const handleRatePress = useCallback(async () => {
    const url = appInfo.appStoreUrl;
    if (!url) {
      Alert.alert(translations?.common || "", translations?.appStoreUrlNotConfigured || "");
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          translations?.common || "",
          translations?.unableToOpenAppStore || ""
        );
        return;
      }
      await Linking.openURL(url);
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.error("[useAuthHandlers] Failed to open app store:", error);
      }
      Alert.alert(translations?.common || "", translations?.failedToOpenAppStore || "");
    }
  }, [appInfo.appStoreUrl, translations]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.error("[useAuthHandlers] Sign out failed:", error);
      }
      AlertService.createErrorAlert(
        translations?.common || "",
        translations?.unknown || ""
      );
    }
  }, [signOut, translations]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteAccountFromAuth();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      AlertService.createErrorAlert(
        translations?.common || "Error",
        errorMessage || translations?.deleteAccountError || "Failed to delete account"
      );
    }
  }, [deleteAccountFromAuth, translations]);

  const handleSignIn = useCallback(() => {
    showAuthModal(undefined, "login");
  }, [showAuthModal]);

  return {
    handleRatePress,
    handleSignOut,
    handleDeleteAccount,
    handleSignIn,
  };
};
