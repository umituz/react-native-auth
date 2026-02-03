/**
 * Password Requirement Item Component
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, useAppDesignTokens } from "@umituz/react-native-design-system";

export interface RequirementItemProps {
  label: string;
  met: boolean;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({ label, met }) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={styles.requirementItem}>
      <View
        style={[
          styles.requirementBullet,
          { backgroundColor: met ? tokens.colors.success : tokens.colors.border },
        ]}
      />
      <AtomicText
        type="bodySmall"
        style={{ color: met ? tokens.colors.textPrimary : tokens.colors.textSecondary }}
      >
        {label}
      </AtomicText>
    </View>
  );
};

const styles = StyleSheet.create({
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
});
