import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens, AtomicText } from "@umituz/react-native-design-system";
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
    ? t("auth.passwordsMatch")
    : t("auth.passwordsDontMatch");

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <AtomicText type="labelSmall" style={{ color }}>{text}</AtomicText>
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
});

