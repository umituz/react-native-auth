/**
 * Profile Section Component
 * Generic user profile section for settings screens
 * Shows user info, sign in CTA for anonymous, or account navigation for signed in users
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
import { Avatar } from "@umituz/react-native-avatar";

export interface ProfileSectionConfig {
    displayName: string;
    userId?: string;
    isAnonymous: boolean;
    avatarUrl?: string;
    accountSettingsRoute?: string;
    benefits?: string[]; // App-specific benefits for anonymous users to encourage sign-in
}

export interface ProfileSectionProps {
    profile: ProfileSectionConfig;
    onPress?: () => void;
    onSignIn?: () => void;
    signInText?: string;
    anonymousText?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
    profile,
    onPress,
    onSignIn,
    signInText = "Sign In",
    anonymousText = "Anonymous User",
}) => {
    const tokens = useAppDesignTokens();

    const handlePress = () => {
        if (profile.isAnonymous && onSignIn) {
            onSignIn();
        } else if (onPress) {
            onPress();
        }
    };



    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: tokens.colors.surface }]}
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={!onPress && !onSignIn}
        >
            <View style={styles.content}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <Avatar
                        uri={profile.avatarUrl}
                        name={profile.displayName || (profile.isAnonymous ? anonymousText : signInText)}
                        size="md"
                        shape="circle"
                    />
                </View>

                {/* User Info */}
                <View style={styles.info}>
                    <Text
                        style={[styles.displayName, { color: tokens.colors.textPrimary }]}
                        numberOfLines={1}
                    >
                        {profile.displayName}
                    </Text>
                    {profile.userId && (
                        <Text
                            style={[styles.userId, { color: tokens.colors.textSecondary }]}
                            numberOfLines={1}
                        >
                            {profile.userId}
                        </Text>
                    )}
                </View>

                {/* Action Icon */}
                {(onPress || onSignIn) && (
                    <Text style={[styles.chevron, { color: tokens.colors.textTertiary }]}>
                        ›
                    </Text>)}
            </View>

            {/* Sign In CTA for Anonymous Users */}
            {profile.isAnonymous && onSignIn && (
                <View
                    style={[
                        styles.ctaContainer,
                        { borderTopColor: tokens.colors.border },
                    ]}
                >
                    {/* Benefits List */}
                    {profile.benefits && profile.benefits.length > 0 && (
                        <View style={styles.benefitsContainer}>
                            {profile.benefits.map((benefit, index) => (
                                <View key={index} style={styles.benefitItem}>
                                    <Text style={[styles.benefitBullet, { color: tokens.colors.primary }]}>
                                        ✓
                                    </Text>
                                    <Text style={[styles.benefitText, { color: tokens.colors.textSecondary }]}>
                                        {benefit}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.ctaButton,
                            { backgroundColor: tokens.colors.primary },
                        ]}
                        onPress={onSignIn}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.ctaText,
                                { color: tokens.colors.onPrimary },
                            ]}
                        >
                            {signInText}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarContainer: {
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    displayName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 2,
    },
    userId: {
        fontSize: 13,
    },
    chevron: {
        fontSize: 24,
        fontWeight: "400",
    },
    ctaContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    benefitsContainer: {
        marginBottom: 16,
        gap: 8,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    benefitBullet: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 2,
    },
    benefitText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    ctaButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    ctaText: {
        fontSize: 15,
        fontWeight: "600",
    },
});
