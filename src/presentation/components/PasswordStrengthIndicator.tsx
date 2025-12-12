/**
 * Password Strength Indicator Component
 * Shows password requirements with visual feedback
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import type { PasswordRequirements } from "../../infrastructure/utils/AuthValidation";

export interface PasswordStrengthIndicatorProps {
  requirements: PasswordRequirements;
  showLabels?: boolean;
}

interface RequirementDotProps {
  label: string;
  isValid: boolean;
  successColor: string;
  pendingColor: string;
}

const RequirementDot: React.FC<RequirementDotProps> = ({
  label,
  isValid,
  successColor,
  pendingColor,
}) => {
  const color = isValid ? successColor : pendingColor;

  return (
    <View style={styles.requirement}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ requirements, showLabels = true }) => {
  const tokens = useAppDesignTokens();
  const successColor = tokens.colors.success;
  const pendingColor = tokens.colors.textTertiary;

  const items = [
    { key: "minLength", label: "8+", isValid: requirements.hasMinLength },
    { key: "uppercase", label: "A-Z", isValid: requirements.hasUppercase },
    { key: "lowercase", label: "a-z", isValid: requirements.hasLowercase },
    { key: "number", label: "0-9", isValid: requirements.hasNumber },
    { key: "special", label: "!@#", isValid: requirements.hasSpecialChar },
  ];

  if (!showLabels) {
    return (
      <View style={styles.dotsOnly}>
        {items.map((item) => (
          <View
            key={item.key}
            style={[
              styles.dotOnly,
              {
                backgroundColor: item.isValid ? successColor : pendingColor,
              },
            ]}
          />
        ))}
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
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
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});
