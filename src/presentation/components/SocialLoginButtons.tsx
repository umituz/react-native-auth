import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, AtomicButton, useAppDesignTokens } from "@umituz/react-native-design-system";
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

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  translations,
  enabledProviders,
  onGooglePress,
  onApplePress,
  googleLoading = false,
  appleLoading = false,
}) => {
  const tokens = useAppDesignTokens();
  const hasGoogle = enabledProviders.includes("google");
  const hasApple = enabledProviders.includes("apple");

  if (!hasGoogle && !hasApple) {
    return null;
  }

  return (
    <View style={[styles.container, { marginTop: tokens.spacing.lg }]}>
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
};

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
  socialButton: {
    minHeight: 48,
  },
});
