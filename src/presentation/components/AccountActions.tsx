import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDesignTokens, AtomicIcon, AtomicText, useAlert, AlertType, AlertMode } from "@umituz/react-native-design-system";
import { actionButtonStyle } from "../utils/commonStyles";

export interface AccountActionsConfig {
  logoutText: string;
  deleteAccountText: string;
  changePasswordText?: string;
  logoutConfirmTitle: string;
  logoutConfirmMessage: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  deleteErrorTitle?: string;
  deleteErrorMessage?: string;
  cancelText: string;
  onLogout: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onChangePassword?: () => void;
  showChangePassword?: boolean;
}

interface AccountActionsProps {
  config: AccountActionsConfig;
}

export const AccountActions: React.FC<AccountActionsProps> = ({ config }) => {
  const tokens = useAppDesignTokens();
  const alert = useAlert();
  const {
    logoutText,
    deleteAccountText,
    changePasswordText,
    logoutConfirmTitle,
    logoutConfirmMessage,
    deleteConfirmTitle,
    deleteConfirmMessage,
    deleteErrorTitle = "Error",
    deleteErrorMessage = "Failed to delete account. Please try again.",
    cancelText,
    onLogout,
    onDeleteAccount,
    onChangePassword,
    showChangePassword = false,
  } = config;

  const handleLogout = () => {
    alert.show(AlertType.WARNING, AlertMode.MODAL, logoutConfirmTitle, logoutConfirmMessage, {
      actions: [
        { id: "cancel", label: cancelText, style: "secondary", onPress: () => {} },
        {
          id: "confirm",
          label: logoutText,
          style: "destructive",
          onPress: async () => {
            try {
              await onLogout();
            } catch {
              // Silently fail - logout error handling is managed elsewhere
            }
          },
        },
      ],
    });
  };

  const handleDeleteAccount = () => {
    alert.show(AlertType.ERROR, AlertMode.MODAL, deleteConfirmTitle, deleteConfirmMessage, {
      actions: [
        { id: "cancel", label: cancelText, style: "secondary", onPress: () => {} },
        {
          id: "confirm",
          label: deleteAccountText,
          style: "destructive",
          onPress: async () => {
            try {
              await onDeleteAccount();
            } catch {
              alert.showError(deleteErrorTitle, deleteErrorMessage, { mode: AlertMode.MODAL });
            }
          },
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      {showChangePassword && onChangePassword && changePasswordText && (
        <TouchableOpacity style={[actionButtonStyle.container, { borderColor: tokens.colors.border }]} onPress={onChangePassword} activeOpacity={0.7}>
          <AtomicIcon name="key-outline" size="md" color="textPrimary" />
          <AtomicText style={actionButtonStyle.text} color="textPrimary">{changePasswordText}</AtomicText>
          <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[actionButtonStyle.container, { borderColor: tokens.colors.border }]} onPress={handleLogout} activeOpacity={0.7}>
        <AtomicIcon name="log-out-outline" size="md" color="error" />
        <AtomicText style={actionButtonStyle.text} color="error">{logoutText}</AtomicText>
        <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
      </TouchableOpacity>

      <TouchableOpacity style={[actionButtonStyle.container, { borderColor: tokens.colors.border }]} onPress={handleDeleteAccount} activeOpacity={0.7}>
        <AtomicIcon name="trash-outline" size="md" color="error" />
        <AtomicText style={actionButtonStyle.text} color="error">{deleteAccountText}</AtomicText>
        <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
});
