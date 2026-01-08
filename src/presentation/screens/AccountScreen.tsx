/**
 * Account Screen
 * Pure UI component for account management
 * Business logic provided via props from app layer
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDesignTokens, ScreenLayout, AtomicIcon, AtomicText } from "@umituz/react-native-design-system";

import { ProfileSection, type ProfileSectionConfig } from "../components/ProfileSection";
import { AccountActions, type AccountActionsConfig } from "../components/AccountActions";

export interface AccountScreenConfig {
    profile: ProfileSectionConfig;
    accountActions?: AccountActionsConfig;
    isAnonymous: boolean;
    editProfileText?: string;
    onEditProfile?: () => void;
    onSignIn?: () => void;
}

export interface AccountScreenProps {
    config: AccountScreenConfig;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ config }) => {
    const tokens = useAppDesignTokens();

    return (
        <ScreenLayout
            scrollable={true}
            edges={['bottom']}
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
                        style={[styles.actionButton, { borderColor: tokens.colors.border }]}
                        onPress={config.onEditProfile}
                        activeOpacity={0.7}
                    >
                        <AtomicIcon name="person-outline" size="md" customColor={tokens.colors.textPrimary} />
                        <AtomicText style={[styles.actionText, { color: tokens.colors.textPrimary }]}>
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
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
    },
    divider: {
        height: 24,
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

