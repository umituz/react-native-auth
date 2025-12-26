/**
 * Account Screen
 * Pure UI component for account management
 * Business logic provided via props from app layer
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens, ScreenLayout } from "@umituz/react-native-design-system";

import { ProfileSection, type ProfileSectionConfig } from "../components/ProfileSection";
import { AccountActions, type AccountActionsConfig } from "../components/AccountActions";

export interface AccountScreenConfig {
    profile: ProfileSectionConfig;
    accountActions?: AccountActionsConfig;
    isAnonymous: boolean;
}

export interface AccountScreenProps {
    config: AccountScreenConfig;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ config }) => {
    const tokens = useAppDesignTokens();

    const handleLogout = () => {
        if (config.accountActions?.onLogout) {
            void config.accountActions.onLogout();
        }
    };

    return (
        <ScreenLayout
            scrollable={true}
            edges={['bottom']}
            backgroundColor={tokens.colors.backgroundPrimary}
            contentContainerStyle={styles.content}
        >
            <ProfileSection
                profile={config.profile}
                onSignIn={config.profile.isAnonymous ? handleLogout : undefined}
            />

            {!config.isAnonymous && config.accountActions && (
                <>
                    <View style={styles.divider} />
                    <AccountActions config={config.accountActions} />
                </>
            )}
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
    },
    divider: {
        height: 24,
    },
});

