/**
 * Login Form Component
 * Single Responsibility: Render login form UI
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system-atoms";
import { useLocalization } from "@umituz/react-native-localization";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthDivider } from "./AuthDivider";
import { AuthLink } from "./AuthLink";

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onNavigateToRegister,
}) => {
  const { t } = useLocalization();
  const {
    email,
    password,
    emailError,
    passwordError,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    handleContinueAsGuest,
    displayError,
  } = useLoginForm();

  return (
    <>
      <View style={styles.inputContainer}>
        <AtomicInput
          label={t("auth.email")}
          value={email}
          onChangeText={handleEmailChange}
          placeholder={t("auth.emailPlaceholder")}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading}
          state={emailError ? "error" : "default"}
          helperText={emailError || undefined}
        />
      </View>

      <View style={styles.inputContainer}>
        <AtomicInput
          label={t("auth.password")}
          value={password}
          onChangeText={handlePasswordChange}
          placeholder={t("auth.passwordPlaceholder")}
          secureTextEntry
          autoCapitalize="none"
          disabled={loading}
          state={passwordError ? "error" : "default"}
          helperText={passwordError || undefined}
        />
      </View>

      <AuthErrorDisplay error={displayError} />

      <View style={styles.buttonContainer}>
        <AtomicButton
          variant="primary"
          onPress={handleSignIn}
          disabled={loading || !email.trim() || !password.trim()}
          fullWidth
          style={styles.signInButton}
        >
          {t("auth.signIn")}
        </AtomicButton>
      </View>

      <AuthDivider />

      <View style={styles.buttonContainer}>
        <AtomicButton
          variant="outline"
          onPress={handleContinueAsGuest}
          disabled={loading}
          fullWidth
          style={styles.guestButton}
          testID="continue-as-guest-button"
        >
          {t("auth.continueAsGuest")}
        </AtomicButton>
      </View>

      <AuthLink
        text={t("auth.dontHaveAccount")}
        linkText={t("auth.createAccount")}
        onPress={onNavigateToRegister}
        disabled={loading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  signInButton: {
    minHeight: 52,
  },
  guestButton: {
    minHeight: 52,
  },
});

