/**
 * Auth Link Component
 * Link text with button for navigation between auth screens
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 */

import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicText, AtomicButton } from "@umituz/react-native-design-system/atoms";

interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

export const AuthLink = memo<AuthLinkProps>(({ text, linkText, onPress, disabled = false }) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={[styles.container, { marginTop: tokens.spacing.xs, paddingTop: tokens.spacing.xs }]}>
      <AtomicText type="bodyMedium" color="textSecondary">
        {text}{" "}
      </AtomicText>
      <AtomicButton
        variant="text"
        onPress={onPress}
        disabled={disabled}
        style={{ paddingHorizontal: tokens.spacing.xs }}
      >
        {linkText}
      </AtomicButton>
    </View>
  );
});

AuthLink.displayName = 'AuthLink';

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});











