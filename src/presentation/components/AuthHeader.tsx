/**
 * Auth Header Component
 * Reusable header for auth screens
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, useResponsiveDesignTokens } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const tokens = useResponsiveDesignTokens();
  const { t } = useLocalization();

  return (
    <View style={[styles.header, { marginBottom: tokens.spacing.xl, paddingHorizontal: tokens.spacing.md }]}>
      <AtomicText
        type="headlineLarge"
        style={{ color: tokens.colors.onPrimary, textAlign: "center" }}
        responsive
      >
        {title}
      </AtomicText>
      {(subtitle || t("auth.subtitle")) && (
        <AtomicText
          type="bodyMedium"
          style={{
            color: tokens.colors.textInverse,
            textAlign: "center",
            marginTop: tokens.spacing.xs,
          }}
          responsive
        >
          {subtitle || t("auth.subtitle")}
        </AtomicText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
});











