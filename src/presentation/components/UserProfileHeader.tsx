/**
 * User Profile Header Component
 * Displays user avatar, name, and ID
 * Works for both guest and authenticated users
 */

import React, { useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  AtomicIcon,
  AtomicText,
  useAppDesignTokens,
} from "@umituz/react-native-design-system";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@umituz/react-native-avatar";

export interface UserProfileHeaderProps {
  /** User display name */
  displayName?: string;
  /** User ID */
  userId?: string;
  /** Whether user is anonymous (device-based ID) */
  isAnonymous?: boolean;
  /** Avatar URL (optional) */
  avatarUrl?: string;
  /** Navigation route for account settings */
  accountSettingsRoute?: string;
  /** Custom onPress handler */
  onPress?: () => void;
  /** Custom anonymous user display name */
  anonymousDisplayName?: string;
  /** Custom avatar service URL */
  avatarServiceUrl?: string;
  /** Default user display name when no displayName provided */
  defaultUserDisplayName?: string;
  /** Default anonymous display name */
  defaultAnonymousDisplayName?: string;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  displayName,
  userId,
  isAnonymous = false,
  avatarUrl,
  accountSettingsRoute,
  onPress,
  anonymousDisplayName,
  avatarServiceUrl,
  defaultUserDisplayName,
  defaultAnonymousDisplayName,
}) => {
  const tokens = useAppDesignTokens();
  const navigation = useNavigation();
  const colors = tokens.colors;
  const spacing = tokens.spacing;
  const finalDisplayName = displayName || (isAnonymous ? anonymousDisplayName || defaultAnonymousDisplayName || "Anonymous" : defaultUserDisplayName || "User");
  const avatarName = isAnonymous ? anonymousDisplayName || defaultAnonymousDisplayName || "Anonymous" : finalDisplayName;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else if (accountSettingsRoute) {
      navigation.navigate(accountSettingsRoute as never);
    }
  }, [onPress, accountSettingsRoute, navigation]);

  const shouldShowChevron = !!(onPress || accountSettingsRoute);
  const isPressable = !!(onPress || accountSettingsRoute);

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginHorizontal: spacing.md,
    },
  ];

  const content = (
    <>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Avatar
            uri={avatarUrl}
            name={avatarName}
            size="lg"
            shape="circle"
          />
        </View>
        <View style={[styles.textContainer, { marginLeft: spacing.md }]}>
          <AtomicText
            type="headlineSmall"
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {finalDisplayName}
          </AtomicText>
          {userId && (
            <AtomicText
              type="bodySmall"
              style={[styles.id, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {userId}
            </AtomicText>
          )}
        </View>
      </View>
      <View style={[styles.chevronContainer, { marginLeft: spacing.sm }]}>
        <AtomicIcon name="chevron-forward" size="md" color="onSurface" />
      </View>
    </>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 20,
    minHeight: 80,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "700",
  },
  id: {
    fontWeight: "500",
    opacity: 0.7,
  },
  chevronContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});


