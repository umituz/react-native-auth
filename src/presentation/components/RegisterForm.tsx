import React, { useRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";
import { AuthLegalLinks, type AuthLegalLinksTranslations } from "./AuthLegalLinks";
import { PasswordStrengthIndicator, type PasswordStrengthTranslations } from "./PasswordStrengthIndicator";
import { PasswordMatchIndicator, type PasswordMatchTranslations } from "./PasswordMatchIndicator";

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

export interface RegisterFormProps {
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
      <AtomicInput
        label={translations.displayName}
        value={displayName}
        onChangeText={handleDisplayNameChange}
        placeholder={translations.displayNamePlaceholder}
        autoCapitalize="words"
        disabled={loading}
        state={fieldErrors.displayName ? "error" : "default"}
        helperText={fieldErrors.displayName || undefined}
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        blurOnSubmit={false}
        style={styles.input}
      />

      <AtomicInput
        ref={emailRef}
        label={translations.email}
        value={email}
        onChangeText={handleEmailChange}
        placeholder={translations.emailPlaceholder}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
        state={fieldErrors.email ? "error" : "default"}
        helperText={fieldErrors.email || undefined}
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
        state={fieldErrors.password ? "error" : "default"}
        helperText={fieldErrors.password || undefined}
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        blurOnSubmit={false}
        textContentType="oneTimeCode"
        style={styles.input}
      />
      {password.length > 0 && (
        <PasswordStrengthIndicator translations={translations.passwordStrength} requirements={passwordRequirements} />
      )}

      <AtomicInput
        ref={confirmPasswordRef}
        label={translations.confirmPassword}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        placeholder={translations.confirmPasswordPlaceholder}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        autoCorrect={false}
        disabled={loading}
        state={fieldErrors.confirmPassword ? "error" : "default"}
        helperText={fieldErrors.confirmPassword || undefined}
        returnKeyType="done"
        onSubmitEditing={() => { void handleSignUp(); }}
        textContentType="oneTimeCode"
        style={styles.input}
      />
      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator translations={translations.passwordMatch} isMatch={passwordsMatch} />
      )}

      <AuthErrorDisplay error={displayError} />

      <AtomicButton
        variant="primary"
        onPress={() => { void handleSignUp(); }}
        disabled={loading || !email.trim() || !password.trim() || !confirmPassword.trim()}
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
  input: { marginBottom: 20 },
  signUpButton: { minHeight: 52, marginBottom: 16, marginTop: 8 },
});
