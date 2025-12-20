/**
 * Password Match Indicator Component
 * Shows whether passwords match
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";

export interface PasswordMatchIndicatorProps {
  isMatch: boolean;
}

export const PasswordMatchIndicator: React.FC<PasswordMatchIndicatorProps> = ({
  isMatch,
}) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();

  const color = isMatch ? tokens.colors.success : tokens.colors.error;
  const text = isMatch
    ? t("auth.passwordsMatch", { defaultValue: "Passwords match" })
    : t("auth.passwordsDontMatch", { defaultValue: "Passwords don't match" });

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});
