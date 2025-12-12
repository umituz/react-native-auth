/**
 * Register Form Component
 * Single Responsibility: Render register form UI
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system-atoms";
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
      <View style={styles.inputContainer}>
        <AtomicInput
          label={t("auth.displayName") || "Full Name"}
          value={displayName}
          onChangeText={handleDisplayNameChange}
          placeholder={
            t("auth.displayNamePlaceholder") || "Enter your full name"
          }
          autoCapitalize="words"
          disabled={loading}
          state={fieldErrors.displayName ? "error" : "default"}
          helperText={fieldErrors.displayName || undefined}
        />
      </View>

      <View style={styles.inputContainer}>
        <AtomicInput
          label={t("auth.email")}
          value={email}
          onChangeText={handleEmailChange}
          placeholder={t("auth.emailPlaceholder")}
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={loading}
          state={fieldErrors.email ? "error" : "default"}
          helperText={fieldErrors.email || undefined}
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
          state={fieldErrors.password ? "error" : "default"}
          helperText={fieldErrors.password || undefined}
        />
        {password.length > 0 && (
          <PasswordStrengthIndicator requirements={passwordRequirements} />
        )}
      </View>

      <View style={styles.inputContainer}>
        <AtomicInput
          label={t("auth.confirmPassword") || "Confirm Password"}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          placeholder={
            t("auth.confirmPasswordPlaceholder") || "Confirm your password"
          }
          secureTextEntry
          autoCapitalize="none"
          disabled={loading}
          state={fieldErrors.confirmPassword ? "error" : "default"}
          helperText={fieldErrors.confirmPassword || undefined}
        />
        {confirmPassword.length > 0 && (
          <PasswordMatchIndicator isMatch={passwordsMatch} />
        )}
      </View>

      <AuthErrorDisplay error={displayError} />

      <View style={styles.buttonContainer}>
        <AtomicButton
          variant="primary"
          onPress={handleSignUp}
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
      </View>

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
        prefixText={t("auth.bySigningUp") || "By signing up, you agree to our"}
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
    marginTop: 8,
  },
  signUpButton: {
    minHeight: 52,
  },
});

