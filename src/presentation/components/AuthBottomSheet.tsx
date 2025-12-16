/**
 * AuthBottomSheet Component
 * Bottom sheet modal for authentication (Login/Register)
 */

import React, { useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";
import { useLocalization } from "@umituz/react-native-localization";
import { X } from "lucide-react-native";
import { useAuthModalStore } from "../stores/authModalStore";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export interface AuthBottomSheetProps {
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();
  const modalRef = useRef<BottomSheetModal>(null);

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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  const snapPoints = ["85%"];

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
          <X size={24} color={tokens.colors.textSecondary} />
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
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
});
