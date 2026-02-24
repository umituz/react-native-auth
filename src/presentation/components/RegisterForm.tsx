import React, { useRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import { AtomicButton } from "@umituz/react-native-design-system/atoms";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";
import { AuthLegalLinks, type AuthLegalLinksTranslations } from "./AuthLegalLinks";
import { PasswordStrengthIndicator, type PasswordStrengthTranslations } from "./PasswordStrengthIndicator";
import { PasswordMatchIndicator, type PasswordMatchTranslations } from "./PasswordMatchIndicator";
import { FormTextInput, FormEmailInput, FormPasswordInput } from "./form";

export interface RegisterFormTranslations {
  displayName: string;
  displayNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  signUp: string;
  alreadyHaveAccount: string;
  signIn: string;
  bySigningUp: string;
  legal: AuthLegalLinksTranslations;
  passwordStrength: PasswordStrengthTranslations;
  passwordMatch: PasswordMatchTranslations;
}

interface RegisterFormProps {
  translations: RegisterFormTranslations;
  onNavigateToLogin: () => void;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  translations,
  onNavigateToLogin,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
  const emailRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const passwordRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const confirmPasswordRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const {
    displayName,
    email,
    password,
    confirmPassword,
    fieldErrors,
    loading,
    passwordRequirements,
    passwordsMatch,
    handleDisplayNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSignUp,
    displayError,
  } = useRegisterForm();

  return (
    <>
      <FormTextInput
        value={displayName}
        onChangeText={handleDisplayNameChange}
        label={translations.displayName}
        placeholder={translations.displayNamePlaceholder}
        error={fieldErrors.displayName}
        disabled={loading}
        autoCapitalize="words"
        onSubmitEditing={() => emailRef.current?.focus()}
        returnKeyType="next"
      />

      <FormEmailInput
        ref={emailRef}
        value={email}
        onChangeText={handleEmailChange}
        label={translations.email}
        placeholder={translations.emailPlaceholder}
        error={fieldErrors.email}
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
        error={fieldErrors.password}
        disabled={loading}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        returnKeyType="next"
        style={styles.passwordInput}
      />
      {password.length > 0 && (
        <PasswordStrengthIndicator translations={translations.passwordStrength} requirements={passwordRequirements} />
      )}

      <FormPasswordInput
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        label={translations.confirmPassword}
        placeholder={translations.confirmPasswordPlaceholder}
        error={fieldErrors.confirmPassword}
        disabled={loading}
        onSubmitEditing={() => { void handleSignUp(); }}
        returnKeyType="done"
        style={styles.confirmPasswordInput}
      />
      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator translations={translations.passwordMatch} isMatch={passwordsMatch} />
      )}

      <AuthErrorDisplay error={displayError} />

      <AtomicButton
        variant="primary"
        onPress={() => { void handleSignUp(); }}
        disabled={loading || !email.trim() || !password || !confirmPassword}
        fullWidth
        style={styles.signUpButton}
      >
        {translations.signUp}
      </AtomicButton>

      <AuthLink text={translations.alreadyHaveAccount} linkText={translations.signIn} onPress={onNavigateToLogin} disabled={loading} />

      <AuthLegalLinks
        translations={translations.legal}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
        onTermsPress={onTermsPress}
        onPrivacyPress={onPrivacyPress}
        prefixText={translations.bySigningUp}
      />
    </>
  );
};

const styles = StyleSheet.create({
  passwordInput: { marginBottom: 4 },
  confirmPasswordInput: { marginBottom: 4 },
  signUpButton: { minHeight: 52, marginBottom: 16, marginTop: 8 },
});
