import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens, AtomicText } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
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
      <AtomicText type="labelSmall" style={{ color }}>{label}</AtomicText>
    </View>
  );
};

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ requirements, showLabels = true }) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();
  const successColor = tokens.colors.success;
  const pendingColor = tokens.colors.textTertiary;

  const items = [
    { key: "minLength", label: t("auth.passwordReq.minLength"), isValid: requirements.hasMinLength },
    { key: "uppercase", label: t("auth.passwordReq.uppercase"), isValid: requirements.hasUppercase },
    { key: "lowercase", label: t("auth.passwordReq.lowercase"), isValid: requirements.hasLowercase },
    { key: "number", label: t("auth.passwordReq.number"), isValid: requirements.hasNumber },
    { key: "special", label: t("auth.passwordReq.special"), isValid: requirements.hasSpecialChar },
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

