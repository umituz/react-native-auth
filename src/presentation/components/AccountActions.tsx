/**
 * Account Actions Component
 * Provides logout and delete account functionality
 * Only shown for authenticated (non-anonymous) users
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";

export interface AccountActionsConfig {
    logoutText?: string;
    deleteAccountText?: string;
    logoutConfirmTitle?: string;
    logoutConfirmMessage?: string;
    deleteConfirmTitle?: string;
    deleteConfirmMessage?: string;
    onLogout: () => Promise<void>;
    onDeleteAccount: () => Promise<void>;
}

export interface AccountActionsProps {
    config: AccountActionsConfig;
}

export const AccountActions: React.FC<AccountActionsProps> = ({ config }) => {
    const tokens = useAppDesignTokens();
    const {
        logoutText = "Log Out",
        deleteAccountText = "Delete Account",
        logoutConfirmTitle = "Log Out?",
        logoutConfirmMessage = "Are you sure you want to log out?",
        deleteConfirmTitle = "Delete Account?",
        deleteConfirmMessage =
        "This will permanently delete your account and all data. This action cannot be undone.",
        onLogout,
        onDeleteAccount,
    } = config;

    const handleLogout = () => {
        Alert.alert(logoutConfirmTitle, logoutConfirmMessage, [
            { text: "Cancel", style: "cancel" },
            {
                text: logoutText,
                style: "destructive",
                onPress: async () => {
                    try {
                        await onLogout();
                    } catch (error) {
                        // Silent error handling
                    }
                },
            },
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(deleteConfirmTitle, deleteConfirmMessage, [
            { text: "Cancel", style: "cancel" },
            {
                text: deleteAccountText,
                style: "destructive",
                onPress: async () => {
                    try {
                        await onDeleteAccount();
                    } catch (error) {
                        // Silent error handling
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Logout */}
            <TouchableOpacity
                style={[styles.actionButton, { borderColor: tokens.colors.border }]}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <Text style={[styles.actionIcon, { color: tokens.colors.error }]}>
                    ⎋
                </Text>
                <Text style={[styles.actionText, { color: tokens.colors.error }]}>
                    {logoutText}
                </Text>
                <Text style={[styles.chevron, { color: tokens.colors.textTertiary }]}>
                    ›
                </Text>
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
                style={[styles.actionButton, { borderColor: tokens.colors.border }]}
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
            >
                <Text style={[styles.actionIcon, { color: tokens.colors.error }]}>
                    🗑
                </Text>
                <Text style={[styles.actionText, { color: tokens.colors.error }]}>
                    {deleteAccountText}
                </Text>
                <Text style={[styles.chevron, { color: tokens.colors.textTertiary }]}>
                    ›
                </Text>
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
    actionIcon: {
        fontSize: 20,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
    chevron: {
        fontSize: 24,
        fontWeight: "400",
    },
});
