import React, { useRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";

export interface LoginFormTranslations {
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signIn: string;
  dontHaveAccount: string;
  createAccount: string;
}

export interface LoginFormProps {
  translations: LoginFormTranslations;
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  translations,
  onNavigateToRegister,
}) => {
  const passwordRef = useRef<React.ElementRef<typeof TextInput>>(null);
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
      <AtomicInput
        label={translations.email}
        value={email}
        onChangeText={handleEmailChange}
        placeholder={translations.emailPlaceholder}
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
        label={translations.password}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder={translations.passwordPlaceholder}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        autoCorrect={false}
        disabled={loading}
        state={passwordError ? "error" : "default"}
        helperText={passwordError || undefined}
        returnKeyType="done"
        onSubmitEditing={() => { void handleSignIn(); }}
        textContentType="oneTimeCode"
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
        {translations.signIn}
      </AtomicButton>

      <AuthLink
        text={translations.dontHaveAccount}
        linkText={translations.createAccount}
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
