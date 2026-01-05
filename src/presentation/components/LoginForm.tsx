/**
 * Login Form Component
 * Single Responsibility: Render login form UI
 */

import React, { useRef } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";

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
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputContainer}>
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
        />
      </View>

      <AuthErrorDisplay error={displayError} />

      <View style={styles.buttonContainer}>
        <AtomicButton
          variant="primary"
          onPress={() => { void handleSignIn(); }}
          disabled={loading || !email.trim() || !password.trim()}
          fullWidth
          style={styles.signInButton}
        >
          {t("auth.signIn")}
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
});
