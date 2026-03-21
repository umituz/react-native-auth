import React, { useRef, memo, useMemo } from "react";
import { StyleSheet, TextInput } from "react-native";
import { AtomicButton } from "@umituz/react-native-design-system/atoms";
import { useResponsive } from "@umituz/react-native-design-system/responsive";
import { useLoginForm } from "../hooks/useLoginForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";
import { FormEmailInput } from "./form/FormEmailInput";
import { FormPasswordInput } from "./form/FormPasswordInput";

export interface LoginFormTranslations {
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signIn: string;
  dontHaveAccount: string;
  createAccount: string;
}

interface LoginFormProps {
  translations: LoginFormTranslations;
  onNavigateToRegister: () => void;
}

export const LoginForm = memo<LoginFormProps>(({
  translations,
  onNavigateToRegister,
}) => {
  const passwordRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const responsive = useResponsive();
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

  const signInButtonStyle = useMemo(() => [
    styles.signInButton,
    { marginBottom: responsive.verticalPadding },
  ], [responsive.verticalPadding]);

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
        style={signInButtonStyle}
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
});

const styles = StyleSheet.create({
  signInButton: {},
});

LoginForm.displayName = 'LoginForm';
