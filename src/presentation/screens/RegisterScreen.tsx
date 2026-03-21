/**
 * Register Screen Component
 * Registration form screen with navigation and social auth support
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 */

import React, { memo, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicCard } from "@umituz/react-native-design-system/atoms";
import { useAppNavigation } from "@umituz/react-native-design-system/molecules";
import { ScreenLayout } from "@umituz/react-native-design-system/layouts";
import { useResponsive } from "@umituz/react-native-design-system/responsive";
import type { SocialAuthConfiguration } from "../hooks/useAuthBottomSheet";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm, type RegisterFormTranslations } from "../components/RegisterForm";
import { SocialLoginButtons, type SocialLoginButtonsTranslations } from "../components/SocialLoginButtons";

export interface RegisterScreenTranslations {
  title: string;
  subtitle?: string;
  form: RegisterFormTranslations;
  socialButtons?: SocialLoginButtonsTranslations;
}

export interface RegisterScreenProps {
  translations: RegisterScreenTranslations;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  socialConfig?: SocialAuthConfiguration;
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
  renderLogo?: () => React.ReactNode;
}

export const RegisterScreen = memo<RegisterScreenProps>(({
  translations,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
  socialConfig,
  onGoogleSignIn,
  onAppleSignIn,
  renderLogo,
}) => {
  const navigation = useAppNavigation();
  const tokens = useAppDesignTokens();
  const responsive = useResponsive();

  // PERFORMANCE: Stable callback reference
  const handleNavigateToLogin = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  // Determine enabled social providers
  const enabledProviders = useMemo<SocialAuthProvider[]>(() => {
    if (!socialConfig) return [];
    const providers: SocialAuthProvider[] = [];
    // For Google, check if config exists
    if (socialConfig.google) providers.push("google");
    // For Apple, check if enabled flag is true
    if (socialConfig.apple?.enabled) providers.push("apple");
    return providers;
  }, [socialConfig]);

  const hasSocialAuth = enabledProviders.length > 0 && translations.socialButtons;
  // Check if required handlers exist for enabled providers (only need handler if provider is enabled)
  const hasGoogle = enabledProviders.includes("google") && onGoogleSignIn;
  const hasApple = enabledProviders.includes("apple") && onAppleSignIn;
  const showSocialButtons = hasSocialAuth && (hasGoogle || hasApple);

  // Store social buttons translations in const to satisfy type checker (safe because we check hasSocialAuth first)
  const socialButtonsTranslations = translations.socialButtons!;

  // PERFORMANCE: Stable callbacks for social sign-in (wrap async handlers)
  const handleGooglePress = useCallback(() => {
    void onGoogleSignIn?.();
  }, [onGoogleSignIn]);

  const handleApplePress = useCallback(() => {
    void onAppleSignIn?.();
  }, [onAppleSignIn]);

  return (
    <ScreenLayout
      scrollable
      keyboardAvoiding
      maxWidth={responsive.maxContentWidth}
      contentContainerStyle={{ justifyContent: "center" }}
      backgroundColor={tokens.colors.backgroundPrimary}
    >
      {/* Optional Logo/Illustration */}
      {renderLogo && (
        <View style={styles.logoContainer}>{renderLogo()}</View>
      )}

      <AuthHeader title={translations.title} subtitle={translations.subtitle} />

      <AtomicCard variant="elevated" padding="lg">
        <RegisterForm
          translations={translations.form}
          onNavigateToLogin={handleNavigateToLogin}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          onTermsPress={onTermsPress}
          onPrivacyPress={onPrivacyPress}
        />

        {/* Social Login Buttons */}
        {showSocialButtons && (
          <SocialLoginButtons
            translations={socialButtonsTranslations}
            enabledProviders={enabledProviders}
            onGooglePress={hasGoogle ? handleGooglePress : undefined}
            onApplePress={hasApple ? handleApplePress : undefined}
          />
        )}
      </AtomicCard>
    </ScreenLayout>
  );
});

RegisterScreen.displayName = 'RegisterScreen';

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
});
