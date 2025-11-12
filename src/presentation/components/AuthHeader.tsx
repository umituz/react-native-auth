/**
 * Auth Header Component
 * Reusable header for auth screens
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useLocalization } from "@umituz/react-native-localization";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();

  return (
    <View style={styles.header}>
      <Text
        style={[
          styles.title,
          { color: tokens.colors.onPrimary || "#FFFFFF" },
        ]}
      >
        {title}
      </Text>
      {(subtitle || t("auth.subtitle")) && (
        <Text
          style={[
            styles.subtitle,
            {
              color:
                tokens.colors.textInverse || "rgba(255, 255, 255, 0.9)",
            },
          ]}
        >
          {subtitle || t("auth.subtitle")}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
    marginTop: 4,
  },
});




