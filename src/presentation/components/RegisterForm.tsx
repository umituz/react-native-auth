/**
 * Register Form Component
 * Single Responsibility: Render register form UI
 */

import React, { useRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";
import { AuthLegalLinks } from "./AuthLegalLinks";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { PasswordMatchIndicator } from "./PasswordMatchIndicator";

interface RegisterFormProps {
  onNavigateToLogin: () => void;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onNavigateToLogin,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
  const { t } = useLocalization();
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
        label={t("auth.displayName")}
        value={displayName}
        onChangeText={handleDisplayNameChange}
        placeholder={
          t("auth.displayNamePlaceholder")
        }
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
        label={t("auth.email")}
        value={email}
        onChangeText={handleEmailChange}
        placeholder={t("auth.emailPlaceholder")}
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
        label={t("auth.password")}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder={t("auth.passwordPlaceholder")}
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
        <PasswordStrengthIndicator requirements={passwordRequirements} />
      )}

      <AtomicInput
        ref={confirmPasswordRef}
        label={t("auth.confirmPassword")}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        placeholder={t("auth.confirmPasswordPlaceholder")}
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
        <PasswordMatchIndicator isMatch={passwordsMatch} />
      )}

      <AuthErrorDisplay error={displayError} />

      <AtomicButton
        variant="primary"
        onPress={() => { void handleSignUp(); }}
        disabled={
          loading ||
          !email.trim() ||
          !password.trim() ||
          !confirmPassword.trim()
        }
        fullWidth
        style={styles.signUpButton}
      >
        {t("auth.signUp")}
      </AtomicButton>

      <AuthLink
        text={t("auth.alreadyHaveAccount")}
        linkText={t("auth.signIn")}
        onPress={onNavigateToLogin}
        disabled={loading}
      />

      <AuthLegalLinks
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
        onTermsPress={onTermsPress}
        onPrivacyPress={onPrivacyPress}
        prefixText={t("auth.bySigningUp")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
  signUpButton: {
    minHeight: 52,
    marginBottom: 16,
    marginTop: 8,
  },
});

