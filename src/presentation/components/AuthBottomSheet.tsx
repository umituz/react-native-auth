/**
 * AuthBottomSheet Component
 * Bottom sheet modal for authentication (Login/Register)
 */

import React, { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useAppDesignTokens, AtomicText, AtomicIcon, AtomicKeyboardAvoidingView } from "@umituz/react-native-design-system";
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
  const modalRef = useRef<BottomSheetModal>(null);

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

  useEffect(() => {
    if (isAuthenticated && !isAnonymous && isVisible) {
      hideAuthModal();
      executePendingCallback();
    }
  }, [isAuthenticated, isAnonymous, isVisible, hideAuthModal, executePendingCallback]);

  const handleDismiss = useCallback(() => {
    hideAuthModal();
    clearPendingCallback();
  }, [hideAuthModal, clearPendingCallback]);

  const handleClose = useCallback(() => {
    modalRef.current?.dismiss();
    handleDismiss();
  }, [handleDismiss]);

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  const snapPoints = useMemo(() => ["95%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backgroundStyle={[styles.background, { backgroundColor: tokens.colors.backgroundPrimary }]}
      handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: tokens.colors.border }]}
    >
      <AtomicKeyboardAvoidingView
        style={{ flex: 1 }}
      >
        <BottomSheetScrollView
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
      </BottomSheetScrollView>
    </AtomicKeyboardAvoidingView>
    </BottomSheetModal>
  );
};

