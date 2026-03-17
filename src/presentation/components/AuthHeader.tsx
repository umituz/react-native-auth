/**
 * Auth Header Component
 * Displays auth screen title and optional subtitle
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 */

import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicText } from "@umituz/react-native-design-system/atoms";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader = memo<AuthHeaderProps>(({ title, subtitle }) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={[styles.header, { marginBottom: tokens.spacing.xl, paddingHorizontal: tokens.spacing.md }]}>
      <AtomicText
        type="headlineLarge"
        color="textPrimary"
        style={{ textAlign: "center" }}
      >
        {title}
      </AtomicText>
      {subtitle && (
        <AtomicText
          type="bodyMedium"
          color="textSecondary"
          style={{
            textAlign: "center",
            marginTop: tokens.spacing.xs,
          }}
        >
          {subtitle}
        </AtomicText>
      )}
    </View>
  );
});

AuthHeader.displayName = 'AuthHeader';

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
});
