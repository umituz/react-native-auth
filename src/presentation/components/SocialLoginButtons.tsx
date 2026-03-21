/**
 * Social Login Buttons Component
 * Google and Apple sign-in buttons
 * PERFORMANCE: Memoized and provider checks memoized to prevent re-renders
 */

import React, { useMemo, memo } from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { useResponsive } from "@umituz/react-native-design-system/responsive";
import { AtomicText, AtomicButton } from "@umituz/react-native-design-system/atoms";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

export interface SocialLoginButtonsTranslations {
  orContinueWith: string;
  google: string;
  apple: string;
}

interface SocialLoginButtonsProps {
  translations: SocialLoginButtonsTranslations;
  enabledProviders: SocialAuthProvider[];
  onGooglePress?: () => void;
  onApplePress?: () => void;
  googleLoading?: boolean;
  appleLoading?: boolean;
}

export const SocialLoginButtons = memo<SocialLoginButtonsProps>(({ translations, enabledProviders, onGooglePress, onApplePress, googleLoading = false, appleLoading = false }) => {
  const tokens = useAppDesignTokens();
  const responsive = useResponsive();

  // PERFORMANCE: Memoize provider checks to prevent recalculation on every render
  const { hasGoogle, hasApple } = useMemo(() => ({
    hasGoogle: enabledProviders.includes("google"),
    hasApple: enabledProviders.includes("apple"),
  }), [enabledProviders]);

  const containerStyle = useMemo(() => [
    styles.container,
    { marginTop: responsive.verticalPadding },
  ], [responsive.verticalPadding]);

  if (!hasGoogle && !hasApple) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: tokens.colors.border }]} />
        <AtomicText type="bodySmall" color="textSecondary" style={styles.dividerText}>
          {translations.orContinueWith}
        </AtomicText>
        <View style={[styles.divider, { backgroundColor: tokens.colors.border }]} />
      </View>

      <View style={styles.buttonsContainer}>
        {hasGoogle && onGooglePress && (
          <AtomicButton
            variant="outline"
            onPress={onGooglePress}
            disabled={googleLoading || appleLoading}
            loading={googleLoading}
            fullWidth
            style={styles.socialButton}
          >
            {translations.google}
          </AtomicButton>
        )}

        {hasApple && onApplePress && (
          <AtomicButton
            variant="outline"
            onPress={onApplePress}
            disabled={googleLoading || appleLoading}
            loading={appleLoading}
            fullWidth
            style={styles.socialButton}
          >
            {translations.apple}
          </AtomicButton>
        )}
      </View>
    </View>
  );
});

SocialLoginButtons.displayName = 'SocialLoginButtons';

const styles = StyleSheet.create({
  container: {},
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  buttonsContainer: {
    gap: 12,
  },
  socialButton: {},
});
