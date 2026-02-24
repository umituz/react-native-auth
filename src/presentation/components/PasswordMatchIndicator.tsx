import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicText } from "@umituz/react-native-design-system/atoms";

export interface PasswordMatchTranslations {
  match: string;
  noMatch: string;
}

interface PasswordMatchIndicatorProps {
  translations: PasswordMatchTranslations;
  isMatch: boolean;
}

export const PasswordMatchIndicator: React.FC<PasswordMatchIndicatorProps> = ({
  translations,
  isMatch,
}) => {
  const tokens = useAppDesignTokens();
  const color = isMatch ? tokens.colors.success : tokens.colors.error;
  const text = isMatch ? translations.match : translations.noMatch;

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
