/**
 * Login Form Component
 * Form fields and actions for login
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { AtomicInput, AtomicButton } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { useAuth } from "../hooks/useAuth";
import { AuthErrorDisplay } from "./AuthErrorDisplay";
import { AuthDivider } from "./AuthDivider";
import { AuthLink } from "./AuthLink";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onNavigateToRegister,
}) => {
  const { t } = useLocalization();
  const { signIn, loading, error, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
    if (localError) setLocalError(null);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
    if (localError) setLocalError(null);
  };

  const handleSignIn = async () => {
    setEmailError(null);
    setPasswordError(null);
    setLocalError(null);

    let hasError = false;

    if (!email.trim()) {
      setEmailError(t("auth.errors.invalidEmail"));
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError(t("auth.errors.invalidEmail"));
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(t("auth.errors.weakPassword"));
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError(t("auth.errors.weakPassword"));
      hasError = true;
    }

    if (hasError) return;

    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = t(localizationKey);
      setLocalError(errorMessage);
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      await continueAsGuest();
    } catch (err) {
      // Error handling is done in the hook
    }
  };

  const displayError = localError || error;

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
          editable={!loading}
          state={emailError ? "error" : "default"}
          helperText={emailError || undefined}
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
          editable={!loading}
          state={passwordError ? "error" : "default"}
          helperText={passwordError || undefined}
        />
      </View>

      <AuthErrorDisplay error={displayError} />

      <View style={styles.buttonContainer}>
        <AtomicButton
          variant="primary"
          onPress={handleSignIn}
          disabled={loading || !email.trim() || !password.trim()}
          fullWidth
          loading={loading}
          style={styles.signInButton}
        >
          {t("auth.signIn")}
        </AtomicButton>
      </View>

      <AuthDivider />

      <View style={styles.buttonContainer}>
        <AtomicButton
          variant="outline"
          onPress={handleContinueAsGuest}
          disabled={loading}
          fullWidth
          style={styles.guestButton}
        >
          {t("auth.continueAsGuest")}
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
  guestButton: {
    minHeight: 52,
  },
});

