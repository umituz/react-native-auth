/**
 * AuthBottomSheet Component
 * Bottom sheet modal for authentication (Login/Register)
 */

import React, { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
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
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    if (isVisible) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isAuthenticated && !isGuest && isVisible) {
      hideAuthModal();
      executePendingCallback();
    }
  }, [isAuthenticated, isGuest, isVisible, hideAuthModal, executePendingCallback]);

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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={[styles.background, { backgroundColor: tokens.colors.backgroundPrimary }]}
      handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: tokens.colors.border }]}
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
        >
          <Text style={[styles.closeIcon, { color: tokens.colors.textSecondary }]}>
            ✕
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: tokens.colors.textPrimary }]}>
            {mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
          </Text>
          <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
            {mode === "login" ? t("auth.signInSubtitle") : t("auth.createAccountSubtitle")}
          </Text>
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
              onGooglePress={handleGoogleSignIn}
              onApplePress={handleAppleSignIn}
              googleLoading={googleLoading}
              appleLoading={appleLoading}
            />
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

