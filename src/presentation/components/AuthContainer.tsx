/**
 * Auth Container Component
 * Main container for auth screens with background and scroll
 */

import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useResponsive, useSafeAreaInsets, AtomicKeyboardAvoidingView, useAppDesignTokens } from "@umituz/react-native-design-system";

/** Layout constants for auth screens */
const AUTH_LAYOUT = {
  VERTICAL_PADDING: 40,
  HORIZONTAL_PADDING: 20,
  MAX_CONTENT_WIDTH: 440,
} as const;

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { spacingMultiplier } = useResponsive();

  const tokens = useAppDesignTokens();

  const dynamicStyles = useMemo(() => ({
    paddingTop: insets.top + (AUTH_LAYOUT.VERTICAL_PADDING * spacingMultiplier),
    paddingBottom: insets.bottom + (AUTH_LAYOUT.VERTICAL_PADDING * spacingMultiplier),
  }), [insets.top, insets.bottom, spacingMultiplier]);

  return (
    <AtomicKeyboardAvoidingView
      style={[styles.container, { backgroundColor: tokens.colors.backgroundPrimary }]}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, dynamicStyles]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </AtomicKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: AUTH_LAYOUT.HORIZONTAL_PADDING,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    maxWidth: AUTH_LAYOUT.MAX_CONTENT_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
});











