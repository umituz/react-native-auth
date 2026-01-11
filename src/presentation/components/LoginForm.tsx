/**
 * Login Form Component
 * Single Responsibility: Render login form UI
 */

import React, { useRef, useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";

declare const __DEV__: boolean;

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onNavigateToRegister }) => {
  const { t } = useLocalization();
  const passwordRef = useRef<TextInput>(null);
  const {
    email,
    password,
    emailError,
    passwordError,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    displayError,
  } = useLoginForm();

  useEffect(() => {
    if (__DEV__) {
      console.log("[LoginForm] Mounted/Updated:", {
        hasEmail: !!email,
        hasPassword: !!password,
        loading,
        hasError: !!displayError,
      });
    }
  }, [email, password, loading, displayError]);

  if (__DEV__) {
    console.log("[LoginForm] Rendering...");
  }

  return (
    <>
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
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        blurOnSubmit={false}
        textContentType="emailAddress"
        style={styles.input}
      />

      <AtomicInput
        ref={passwordRef}
        label={t("auth.password")}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder={t("auth.passwordPlaceholder")}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        disabled={loading}
        state={passwordError ? "error" : "default"}
        helperText={passwordError || undefined}
        returnKeyType="done"
        onSubmitEditing={() => { void handleSignIn(); }}
        textContentType="password"
        style={styles.input}
      />

      <AuthErrorDisplay error={displayError} />

      <AtomicButton
        variant="primary"
        onPress={() => { void handleSignIn(); }}
        disabled={loading || !email.trim() || !password.trim()}
        fullWidth
        style={styles.signInButton}
      >
        {t("auth.signIn")}
      </AtomicButton>

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
  input: {
    marginBottom: 20,
  },
  signInButton: {
    minHeight: 52,
    marginBottom: 16,
  },
});
