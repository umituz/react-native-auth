/**
 * Register Form Component
 * Form fields and actions for registration
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  batchValidate,
} from "@umituz/react-native-validation";
import { useAuth } from "../hooks/useAuth";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthLink } from "./AuthLink";
import { AuthLegalLinks } from "./AuthLegalLinks";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";

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
  const { signUp, loading, error } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleDisplayNameChange = (text: string) => {
    setDisplayName(text);
    if (fieldErrors.displayName) {
      setFieldErrors({ ...fieldErrors, displayName: undefined });
    }
    if (localError) setLocalError(null);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (fieldErrors.email) {
      setFieldErrors({ ...fieldErrors, email: undefined });
    }
    if (localError) setLocalError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: undefined });
    }
    if (fieldErrors.confirmPassword) {
      setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
    }
    if (localError) setLocalError(null);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (fieldErrors.confirmPassword) {
      setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
    }
    if (localError) setLocalError(null);
  };

  const handleSignUp = async () => {
    setLocalError(null);
    setFieldErrors({});

    const validationResult = batchValidate([
      {
        field: "email",
        validator: () => validateEmail(email.trim()),
      },
      {
        field: "password",
        validator: () =>
          validatePassword(password, {
            minLength: 6,
            requireUppercase: false,
            requireLowercase: false,
            requireNumber: false,
          }),
      },
      {
        field: "confirmPassword",
        validator: () =>
          validatePasswordConfirmation(password, confirmPassword),
      },
    ]);

    if (!validationResult.isValid) {
      setFieldErrors(validationResult.errors);
      return;
    }

    try {
      await signUp(
        email.trim(),
        password,
        displayName.trim() || undefined,
      );
    } catch (err: any) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = t(localizationKey);
      setLocalError(errorMessage);
    }
  };

  const displayError = localError || error;

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

