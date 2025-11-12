/**
 * Auth Gradient Background Component
 * Gradient background for auth screens
 */

import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDesignTokens } from "@umituz/react-native-theme";

export const AuthGradientBackground: React.FC = () => {
  const tokens = useAppDesignTokens();

  return (
    <LinearGradient
      colors={[tokens.colors.primary, tokens.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
};



