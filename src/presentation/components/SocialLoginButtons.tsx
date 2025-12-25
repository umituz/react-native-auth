import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAppDesignTokens, AtomicText, AtomicIcon } from "@umituz/react-native-design-system";
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

  const showGoogle = enabledProviders.includes("google");
  const showApple = enabledProviders.includes("apple") && Platform.OS === "ios";

  if (!showGoogle && !showApple) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: tokens.colors.border }]} />
        <AtomicText type="bodySmall" color="secondary" style={styles.dividerText}>
          {t("auth.orContinueWith")}
        </AtomicText>
        <View style={[styles.divider, { backgroundColor: tokens.colors.border }]} />
      </View>

      <View style={styles.buttonsContainer}>
        {showGoogle && (
          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: tokens.colors.border },
              disabled && styles.disabledButton,
            ]}
            onPress={onGooglePress}
            disabled={disabled || googleLoading}
            activeOpacity={0.7}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={tokens.colors.textPrimary} />
            ) : (
              <>
                <AtomicIcon name="google" size="sm" />
                <AtomicText style={[styles.buttonText, { color: tokens.colors.textPrimary }]}>
                  {t("auth.google")}
                </AtomicText>
              </>
            )}
          </TouchableOpacity>
        )}

        {showApple && (
          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: tokens.colors.border },
              disabled && styles.disabledButton,
            ]}
            onPress={onApplePress}
            disabled={disabled || appleLoading}
            activeOpacity={0.7}
          >
            {appleLoading ? (
              <ActivityIndicator size="small" color={tokens.colors.textPrimary} />
            ) : (
              <>
                <AtomicIcon name="apple" size="sm" color="primary" />
                <AtomicText style={[styles.buttonText, { color: tokens.colors.textPrimary }]}>
                  {t("auth.apple")}
                </AtomicText>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

