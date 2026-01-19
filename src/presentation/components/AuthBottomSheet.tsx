/**
 * AuthBottomSheet Component
 * Bottom sheet modal for authentication (Login/Register)
 */

import React, { useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  useAppDesignTokens,
  AtomicText,
  AtomicIcon,
  AtomicKeyboardAvoidingView,
  BottomSheetModal,
} from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { useAuthBottomSheet, type SocialAuthConfiguration } from "../hooks/useAuthBottomSheet";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { styles } from "./AuthBottomSheet.styles";

declare const __DEV__: boolean;

export interface AuthBottomSheetProps {
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  /** Social auth configuration */
  socialConfig?: SocialAuthConfiguration;
  /** Called when Google sign-in is requested (overrides internal behavior) */
  onGoogleSignIn?: () => Promise<void>;
  /** Called when Apple sign-in is requested (overrides internal behavior) */
  onAppleSignIn?: () => Promise<void>;
  /** Called when auth completes successfully (login or register) */
  onAuthSuccess?: () => void;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
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
  const { t } = useLocalization();

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

  useEffect(() => {
    if (__DEV__) {
      console.log("[AuthBottomSheet] Rendered with:", {
        mode,
        providersCount: providers.length,
        hasModalRef: !!modalRef.current,
        hasTermsUrl: !!termsUrl,
        hasPrivacyUrl: !!privacyUrl,
      });
    }
  }, [mode, providers.length, termsUrl, privacyUrl, modalRef]);

  if (__DEV__) {
    console.log("[AuthBottomSheet] Rendering...");
  }

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
          accessibilityLabel={t("common.close")}
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
            {mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
          </AtomicText>
          <AtomicText type="bodyLarge" color="textSecondary" style={styles.subtitle}>
            {mode === "login" ? t("auth.signInSubtitle") : t("auth.createAccountSubtitle")}
          </AtomicText>
        </View>

        <View style={styles.formContainer}>
          {mode === "login" ? (
            <LoginForm onNavigateToRegister={handleNavigateToRegister} />
          ) : (
            <RegisterForm
              onNavigateToLogin={handleNavigateToLogin}
              termsUrl={termsUrl}
              privacyUrl={privacyUrl}
              onTermsPress={onTermsPress}
              onPrivacyPress={onPrivacyPress}
            />
          )}

          {providers.length > 0 && (
            <SocialLoginButtons
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

