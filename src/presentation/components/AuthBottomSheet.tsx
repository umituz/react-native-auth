/**
 * AuthBottomSheet Component
 * Bottom sheet modal for authentication (Login/Register)
 */

import React, { useEffect, useCallback, useRef, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  useAppDesignTokens,
  AtomicText,
  AtomicIcon,
  AtomicKeyboardAvoidingView,
  BottomSheetModal,
  type BottomSheetModalRef,
} from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { useAuthModalStore } from "../stores/authModalStore";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { styles } from "./AuthBottomSheet.styles";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

export interface AuthBottomSheetProps {
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  /** Enabled social auth providers */
  socialProviders?: SocialAuthProvider[];
  /** Called when Google sign-in is requested */
  onGoogleSignIn?: () => Promise<void>;
  /** Called when Apple sign-in is requested */
  onAppleSignIn?: () => Promise<void>;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
  socialProviders = [],
  onGoogleSignIn,
  onAppleSignIn,
}) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();
  const modalRef = useRef<BottomSheetModalRef>(null);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const { isVisible, mode, hideAuthModal, setMode, executePendingCallback, clearPendingCallback } =
    useAuthModalStore();
  const { isAuthenticated, isAnonymous } = useAuth();

  useEffect(() => {
    if (isVisible) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleDismiss = useCallback(() => {
    hideAuthModal();
    clearPendingCallback();
  }, [hideAuthModal, clearPendingCallback]);

  const handleClose = useCallback(() => {
    modalRef.current?.dismiss();
    handleDismiss();
  }, [handleDismiss]);

  const prevIsAuthenticatedRef = useRef(isAuthenticated);
  const prevIsVisibleRef = useRef(isVisible);

  useEffect(() => {
    // Only close the modal if the user was NOT authenticated and then BECOMES authenticated 
    // while the modal is visible.
    if (!prevIsAuthenticatedRef.current && isAuthenticated && isVisible && !isAnonymous) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[AuthBottomSheet] Auto-closing due to successful authentication transition");
      }
      handleClose();
      executePendingCallback();
    }
    
    // Update ref for next render
    prevIsAuthenticatedRef.current = isAuthenticated;
    prevIsVisibleRef.current = isVisible;
  }, [isAuthenticated, isVisible, isAnonymous, executePendingCallback, handleClose]);

  const handleNavigateToRegister = useCallback(() => {
    setMode("register");
  }, [setMode]);

  const handleNavigateToLogin = useCallback(() => {
    setMode("login");
  }, [setMode]);

  const handleGoogleSignIn = useCallback(async () => {
    if (!onGoogleSignIn) return;
    setGoogleLoading(true);
    try {
      await onGoogleSignIn();
    } finally {
      setGoogleLoading(false);
    }
  }, [onGoogleSignIn]);

  const handleAppleSignIn = useCallback(async () => {
    if (!onAppleSignIn) return;
    setAppleLoading(true);
    try {
      await onAppleSignIn();
    } finally {
      setAppleLoading(false);
    }
  }, [onAppleSignIn]);

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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={t("common.close")}
          accessibilityRole="button"
        >
          <AtomicIcon name="close" size="md" color="secondary" />
        </TouchableOpacity>

        <View style={styles.header}>
          <AtomicText type="headlineLarge" color="primary" style={styles.title}>
            {mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
          </AtomicText>
          <AtomicText type="bodyLarge" color="secondary" style={styles.subtitle}>
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

          {socialProviders.length > 0 && (
            <SocialLoginButtons
              enabledProviders={socialProviders}
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

