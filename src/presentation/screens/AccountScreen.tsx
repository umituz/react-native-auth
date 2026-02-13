/**
 * Account Screen
 * Pure UI component for account management
 * Business logic provided via props from app layer
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDesignTokens, ScreenLayout, AtomicIcon, AtomicText } from "@umituz/react-native-design-system";
import { actionButtonStyle } from "../utils/commonStyles";

import { ProfileSection, type ProfileSectionConfig } from "../components/ProfileSection";
import { AccountActions, type AccountActionsConfig } from "../components/AccountActions";

export interface AccountScreenConfig {
    profile: ProfileSectionConfig;
    accountActions?: AccountActionsConfig;
    isAnonymous: boolean;
    editProfileText?: string;
    onEditProfile?: () => void;
    onSignIn?: () => void;
    title?: string;
    PasswordPromptComponent?: React.ReactNode;
}

export interface AccountScreenProps {
    config: AccountScreenConfig;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ config }) => {
    const tokens = useAppDesignTokens();

    return (
        <>
            <ScreenLayout
                scrollable={true}
                edges={['top', 'bottom']}
                backgroundColor={tokens.colors.backgroundPrimary}
                contentContainerStyle={styles.content}
            >
                <ProfileSection
                    profile={config.profile}
                    onSignIn={config.isAnonymous ? config.onSignIn : undefined}
                    signInText="Sign In"
                />

                {/* Edit Profile Option */}
                {!config.isAnonymous && config.onEditProfile && config.editProfileText && (
                    <>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            style={[actionButtonStyle.container, { borderColor: tokens.colors.border }]}
                            onPress={config.onEditProfile}
                            activeOpacity={0.7}
                        >
                            <AtomicIcon name="person-outline" size="md" customColor={tokens.colors.textPrimary} />
                            <AtomicText style={[actionButtonStyle.text, { color: tokens.colors.textPrimary }]}>
                                {config.editProfileText}
                            </AtomicText>
                            <AtomicIcon name="chevron-forward" size="sm" color="secondary" />
                        </TouchableOpacity>
                    </>
                )}

                {!config.isAnonymous && config.accountActions && (
                    <>
                        <View style={styles.divider} />
                        <AccountActions config={config.accountActions} />
                    </>
                )}
            </ScreenLayout>
            {config.PasswordPromptComponent}
        </>
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

