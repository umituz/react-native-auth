/**
 * Auth Background Component
 * Standard background for auth screens
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";

export const AuthBackground: React.FC = () => {
  const tokens = useAppDesignTokens();

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: tokens.colors.backgroundPrimary }
      ]}
    />
  );
};
