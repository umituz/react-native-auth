/**
 * Auth Link Component
 * Link text with button for navigation between auth screens
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, AtomicButton, useAppDesignTokens } from "@umituz/react-native-design-system";

interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
  text,
  linkText,
  onPress,
  disabled = false,
}) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={[styles.container, { marginTop: tokens.spacing.xs, paddingTop: tokens.spacing.xs }]}>
      <AtomicText
        type="bodyMedium"
        style={{ color: tokens.colors.textSecondary }}
      >
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
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});











