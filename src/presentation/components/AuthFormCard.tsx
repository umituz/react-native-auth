/**
 * Auth Form Card Component
 * Reusable card container for auth forms
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-theme";

interface AuthFormCardProps {
  children: React.ReactNode;
}

export const AuthFormCard: React.FC<AuthFormCardProps> = ({ children }) => {
  const tokens = useAppDesignTokens();

  return (
    <View
      style={[
        styles.formCard,
        { backgroundColor: tokens.colors.surface || "#FFFFFF" },
      ]}
    >
      <View style={styles.form}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    borderRadius: 24,
    padding: 24,
  },
  form: {
    width: "100%",
  },
});

