/**
 * Auth Error Display Component
 * Displays authentication errors using design system tokens
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, useAppDesignTokens } from "@umituz/react-native-design-system";

interface AuthErrorDisplayProps {
  error: string | null;
}

export const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  error,
}) => {
  const tokens = useAppDesignTokens();

  if (!error) {
    return null;
  }

  return (
    <View
      style={[
        styles.errorContainer,
        {
          backgroundColor: tokens.colors.errorLight,
          borderColor: tokens.colors.error,
        },
      ]}
    >
      <AtomicText
        type="bodyMedium"
        color="error"
        style={styles.errorText}
      >
        {error}
      </AtomicText>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    textAlign: "center",
    fontWeight: "500",
  },
});











