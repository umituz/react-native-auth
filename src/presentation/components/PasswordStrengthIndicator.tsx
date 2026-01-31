import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens, AtomicText, type ColorVariant } from "@umituz/react-native-design-system";
import type { PasswordRequirements } from "../../infrastructure/utils/AuthValidation";

export interface PasswordStrengthTranslations {
  minLength: string;
}

export interface PasswordStrengthIndicatorProps {
  translations: PasswordStrengthTranslations;
  requirements: PasswordRequirements;
  showLabels?: boolean;
}

interface RequirementDotProps {
  label: string;
  isValid: boolean;
  successColor: ColorVariant;
  pendingColor: ColorVariant;
}

const RequirementDot: React.FC<RequirementDotProps> = ({
  label,
  isValid,
  successColor,
  pendingColor,
}) => {
  const tokens = useAppDesignTokens();
  const colorKey = isValid ? successColor : pendingColor;
  const dotColor = (tokens.colors as Record<string, string>)[colorKey] || tokens.colors.textTertiary;

  return (
    <View style={styles.requirement}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <AtomicText type="labelSmall" color={colorKey}>
        {label}
      </AtomicText>
    </View>
  );
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  translations,
  requirements,
  showLabels = true,
}) => {
  const tokens = useAppDesignTokens();
  const successColor: ColorVariant = "success";
  const pendingColor: ColorVariant = "textTertiary";

  const items = [
    { key: "minLength", label: translations.minLength, isValid: requirements.hasMinLength },
  ];

  if (!showLabels) {
    return (
      <View style={styles.dotsOnly}>
        {items.map((item) => {
          const colorKey = item.isValid ? successColor : pendingColor;
          const dotColor = (tokens.colors as Record<string, string>)[colorKey] || tokens.colors.textTertiary;

          return (
            <View
              key={item.key}
              style={[styles.dotOnly, { backgroundColor: dotColor }]}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <RequirementDot
          key={item.key}
          label={item.label}
          isValid={item.isValid}
          successColor={successColor}
          pendingColor={pendingColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  dotsOnly: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOnly: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
