import React from "react";
import {
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { useAppDesignTokens, Divider, AtomicButton } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

export interface SocialLoginButtonsProps {
  /** Enabled providers to display */
  enabledProviders: SocialAuthProvider[];
  /** Called when Google sign-in is pressed */
  onGooglePress?: () => void;
  /** Called when Apple sign-in is pressed */
  onApplePress?: () => void;
  /** Loading state for Google button */
  googleLoading?: boolean;
  /** Loading state for Apple button */
  appleLoading?: boolean;
  /** Disable all buttons */
  disabled?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  enabledProviders,
  onGooglePress,
  onApplePress,
  googleLoading = false,
  appleLoading = false,
  disabled = false,
}) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();

  const safeEnabledProviders = enabledProviders ?? [];
  const showGoogle = safeEnabledProviders.includes("google");
  const showApple = safeEnabledProviders.includes("apple") && Platform.OS === "ios";

  if (!showGoogle && !showApple) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Divider text={t("auth.orContinueWith")} spacing="large" />

      <View style={styles.buttonsContainer}>
        {showGoogle && (
          <AtomicButton
            variant="outline"
            onPress={onGooglePress || (() => {})}
            loading={googleLoading}
            disabled={disabled}
            icon="logo-google"
            fullWidth
            style={styles.socialButton}
          >
            {t("auth.google")}
          </AtomicButton>
        )}

        {showApple && (
          <AtomicButton
            variant="outline"
            onPress={onApplePress || (() => {})}
            loading={appleLoading}
            disabled={disabled}
            icon="logo-apple"
            fullWidth
            style={styles.socialButton}
          >
            {t("auth.apple")}
          </AtomicButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
});

