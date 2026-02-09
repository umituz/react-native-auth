/**
 * Profile Section Component
 * Generic user profile section for settings screens
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useAppDesignTokens, AtomicText, AtomicIcon, AtomicAvatar } from "@umituz/react-native-design-system";
import { ProfileBenefitsList } from "./ProfileBenefitsList";

export interface ProfileSectionConfig {
  displayName?: string;
  userId?: string;
  isAnonymous: boolean;
  avatarUrl?: string;
  accountSettingsRoute?: string;
  benefits?: string[];
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
  signInText,
  anonymousText,
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
        <View style={styles.avatarContainer}>
          <AtomicAvatar
            source={profile.avatarUrl ? { uri: profile.avatarUrl } : undefined}
            name={profile.displayName || (profile.isAnonymous ? anonymousText : signInText)}
            size="md"
          />
        </View>

        <View style={styles.info}>
          <AtomicText type="titleMedium" color="textPrimary" numberOfLines={1} style={styles.displayName}>
            {profile.displayName}
          </AtomicText>
          {profile.userId && (
            <AtomicText type="bodySmall" color="textSecondary" numberOfLines={1}>
              {profile.userId}
            </AtomicText>
          )}
        </View>

        {onPress && !profile.isAnonymous && (
          <AtomicIcon name="chevron-forward" size="sm" color="textSecondary" />
        )}
      </View>

      {profile.isAnonymous && onSignIn && (
        <View style={[styles.ctaContainer, { borderTopColor: tokens.colors.border }]}>
          {profile.benefits && profile.benefits.length > 0 && (
            <ProfileBenefitsList benefits={profile.benefits} />
          )}

          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: tokens.colors.primary }]}
            onPress={onSignIn}
            activeOpacity={0.8}
          >
            <AtomicText type="labelLarge" style={{ color: tokens.colors.onPrimary }}>
              {signInText}
            </AtomicText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 12, padding: 16, marginBottom: 16 },
  content: { flexDirection: "row", alignItems: "center" },
  avatarContainer: { marginRight: 12 },
  info: { flex: 1 },
  displayName: { marginBottom: 2 },
  ctaContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  ctaButton: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
});
