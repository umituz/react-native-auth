/**
 * Account Actions Component
 * Provides logout and delete account functionality
 * Only shown for authenticated (non-anonymous) users
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDesignTokens, AtomicIcon, AtomicText, useAlert, AlertType, AlertMode } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";

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
    onLogout: () => Promise<void>;
    onDeleteAccount: () => Promise<void>;
    onChangePassword?: () => void;
    showChangePassword?: boolean;
}

export interface AccountActionsProps {
    config: AccountActionsConfig;
}

export const AccountActions: React.FC<AccountActionsProps> = ({ config }) => {
    const tokens = useAppDesignTokens();
    const alert = useAlert();
    const { t } = useLocalization();
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
        onLogout,
        onDeleteAccount,
        onChangePassword,
        showChangePassword = false,
    } = config;

    const handleLogout = () => {
        alert.show(AlertType.WARNING, AlertMode.MODAL, logoutConfirmTitle, logoutConfirmMessage, {
            actions: [
                {
                    id: "cancel",
                    label: t("common.cancel"),
                    style: "secondary",
                    onPress: () => {},
                },
                {
                    id: "confirm",
                    label: logoutText,
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await onLogout();
                        } catch (error) {
                            // Silent error handling
                        }
                    },
                },
            ],
        });
    };

    const handleDeleteAccount = () => {
        alert.show(AlertType.ERROR, AlertMode.MODAL, deleteConfirmTitle, deleteConfirmMessage, {
            actions: [
                {
                    id: "cancel",
                    label: t("common.cancel"),
                    style: "secondary",
                    onPress: () => {},
                },
                {
                    id: "confirm",
                    label: deleteAccountText,
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await onDeleteAccount();
                        } catch (error) {
                            alert.showError(deleteErrorTitle, deleteErrorMessage, { mode: AlertMode.MODAL });
                        }
                    },
                },
            ],
        });
    };

    return (
        <View style={styles.container}>
            {/* Change Password */}
            {showChangePassword && onChangePassword && changePasswordText && (
                <TouchableOpacity
                    style={[styles.actionButton, { borderColor: tokens.colors.border }]}
                    onPress={onChangePassword}
                    activeOpacity={0.7}
                >
                    <AtomicIcon name="key-outline" size="md" color="textPrimary" />
                    <AtomicText style={styles.actionText} color="textPrimary">
                        {changePasswordText}
                    </AtomicText>
                    <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
                </TouchableOpacity>
            )}

            {/* Logout */}
            <TouchableOpacity
                style={[styles.actionButton, { borderColor: tokens.colors.border }]}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <AtomicIcon name="log-out-outline" size="md" color="error" />
                <AtomicText style={styles.actionText} color="error">
                    {logoutText}
                </AtomicText>
                <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
                style={[styles.actionButton, { borderColor: tokens.colors.border }]}
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
            >
                <AtomicIcon name="trash-outline" size="md" color="error" />
                <AtomicText style={styles.actionText} color="error">
                    {deleteAccountText}
                </AtomicText>
                <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
});
