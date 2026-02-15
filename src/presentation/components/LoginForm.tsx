import React, { useRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import { AtomicButton } from "@umituz/react-native-design-system";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";
import { FormEmailInput, FormPasswordInput } from "./form";

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
      <FormEmailInput
        value={email}
        onChangeText={handleEmailChange}
        label={translations.email}
        placeholder={translations.emailPlaceholder}
        error={emailError}
        disabled={loading}
        onSubmitEditing={() => passwordRef.current?.focus()}
        returnKeyType="next"
      />

      <FormPasswordInput
        ref={passwordRef}
        value={password}
        onChangeText={handlePasswordChange}
        label={translations.password}
        placeholder={translations.passwordPlaceholder}
        error={passwordError}
        disabled={loading}
        onSubmitEditing={() => { void handleSignIn(); }}
        returnKeyType="done"
      />

      <AuthErrorDisplay error={displayError} />

      <AtomicButton
        variant="primary"
        onPress={() => { void handleSignIn(); }}
        disabled={loading || !email.trim() || !password}
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
  signInButton: {
    minHeight: 52,
    marginBottom: 16,
  },
});
