/**
 * Account Screen
 * Pure UI component for account management
 * Business logic provided via props from app layer
 */

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { ProfileSection, type ProfileSectionConfig } from "../components/ProfileSection";
import { AccountActions, type AccountActionsConfig } from "../components/AccountActions";

export interface AccountScreenConfig {
    profile: ProfileSectionConfig;
    accountActions: AccountActionsConfig;
}

export interface AccountScreenProps {
    config: AccountScreenConfig;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ config }) => {
    const tokens = useAppDesignTokens();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: tokens.colors.backgroundPrimary }]}
            contentContainerStyle={styles.content}
        >
            <ProfileSection profile={config.profile} />
            <View style={styles.divider} />
            <AccountActions config={config.accountActions} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    divider: {
        height: 24,
    },
});
