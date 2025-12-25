/**
 * Auth Divider Component
 * Divider with "OR" text for auth screens
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, useResponsiveDesignTokens } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";

export const AuthDivider: React.FC = () => {
  const tokens = useResponsiveDesignTokens();
  const { t } = useLocalization();

  return (
    <View style={[styles.divider, { marginVertical: tokens.spacing.md }]}>
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: tokens.colors.borderLight },
        ]}
      />
      <AtomicText
        style={{
          color: tokens.colors.textSecondary,
          marginHorizontal: tokens.spacing.sm,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
        responsive
      >
        {t("general.or")}
      </AtomicText>
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: tokens.colors.borderLight },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
});











