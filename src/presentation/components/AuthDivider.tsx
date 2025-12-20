/**
 * Auth Divider Component
 * Divider with "OR" text for auth screens
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";

export const AuthDivider: React.FC = () => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();

  return (
    <View style={styles.divider}>
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: tokens.colors.borderLight || "#E5E5E5" },
        ]}
      />
      <Text
        style={[
          styles.dividerText,
          { color: tokens.colors.textSecondary || "#999999" },
        ]}
      >
        {t("general.or")}
      </Text>
      <View
        style={[
          styles.dividerLine,
          { backgroundColor: tokens.colors.borderLight || "#E5E5E5" },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});











