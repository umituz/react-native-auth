import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicText, AtomicIcon, AtomicKeyboardAvoidingView } from "@umituz/react-native-design-system/atoms";
import { BottomSheetModal } from "@umituz/react-native-design-system/molecules";
import { useAuthBottomSheet, type SocialAuthConfiguration } from "../hooks/useAuthBottomSheet";
import { LoginForm, type LoginFormTranslations } from "./LoginForm";
import { RegisterForm, type RegisterFormTranslations } from "./RegisterForm";
import { SocialLoginButtons, type SocialLoginButtonsTranslations } from "./SocialLoginButtons";
import { styles } from "./AuthBottomSheet.styles";

export interface AuthBottomSheetTranslations {
  close: string;
  signIn: string;
  signInSubtitle: string;
  createAccount: string;
  createAccountSubtitle: string;
  loginForm: LoginFormTranslations;
  registerForm: RegisterFormTranslations;
  socialButtons: SocialLoginButtonsTranslations;
}

export interface AuthBottomSheetProps {
  translations: AuthBottomSheetTranslations;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  socialConfig?: SocialAuthConfiguration;
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
  onAuthSuccess?: () => void;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  translations,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
  socialConfig,
  onGoogleSignIn,
  onAppleSignIn,
  onAuthSuccess,
}) => {
  const tokens = useAppDesignTokens();

  const {
    modalRef,
    googleLoading,
    appleLoading,
    mode,
    providers,
    handleDismiss,
    handleClose,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({ socialConfig, onGoogleSignIn, onAppleSignIn, onAuthSuccess });

  return (
    <BottomSheetModal
      ref={modalRef}
      onDismiss={handleDismiss}
      preset="full"
      backgroundColor={tokens.colors.backgroundPrimary}
    >
      <AtomicKeyboardAvoidingView
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={translations.close}
          accessibilityRole="button"
        >
          <AtomicIcon name="close" size="md" color="textSecondary" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <AtomicText type="headlineLarge" color="textPrimary" style={styles.title}>
              {mode === "login" ? translations.signIn : translations.createAccount}
            </AtomicText>
            <AtomicText type="bodyLarge" color="textSecondary" style={styles.subtitle}>
              {mode === "login" ? translations.signInSubtitle : translations.createAccountSubtitle}
            </AtomicText>
          </View>

          <View style={styles.formContainer}>
            {mode === "login" ? (
              <LoginForm
                translations={translations.loginForm}
                onNavigateToRegister={handleNavigateToRegister}
              />
            ) : (
              <RegisterForm
                translations={translations.registerForm}
                onNavigateToLogin={handleNavigateToLogin}
                termsUrl={termsUrl}
                privacyUrl={privacyUrl}
                onTermsPress={onTermsPress}
                onPrivacyPress={onPrivacyPress}
              />
            )}

            {providers.length > 0 && (
              <SocialLoginButtons
                translations={translations.socialButtons}
                enabledProviders={providers}
                onGooglePress={() => { void handleGoogleSignIn(); }}
                onApplePress={() => { void handleAppleSignIn(); }}
                googleLoading={googleLoading}
                appleLoading={appleLoading}
              />
            )}
          </View>
        </ScrollView>
    </AtomicKeyboardAvoidingView>
    </BottomSheetModal>
  );
};

