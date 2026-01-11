/**
 * useLoginForm Hook
 * Single Responsibility: Handle login form logic
 */

import { useState, useCallback } from "react";
import { useLocalization } from "@umituz/react-native-localization";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";
import { validateEmail, validatePasswordForLogin } from "../../infrastructure/utils/AuthValidation";
import { AlertService, alertService } from "@umituz/react-native-design-system";

export interface UseLoginFormResult {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  localError: string | null;
  loading: boolean;
  handleEmailChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleSignIn: () => Promise<void>;
  handleContinueAnonymously: () => Promise<void>;
  displayError: string | null;
}

export function useLoginForm(): UseLoginFormResult {
  const { t } = useLocalization();
  const { signIn, loading, error, continueAnonymously } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      if (emailError) setEmailError(null);
      if (localError) setLocalError(null);
    },
    [emailError, localError],
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (passwordError) setPasswordError(null);
      if (localError) setLocalError(null);
    },
    [passwordError, localError],
  );

  const handleSignIn = useCallback(async () => {
    setEmailError(null);
    setPasswordError(null);
    setLocalError(null);

    let hasError = false;

    const emailResult = validateEmail(email.trim());
    if (!emailResult.isValid && emailResult.error) {
      setEmailError(t(emailResult.error));
      hasError = true;
    }

    const passwordResult = validatePasswordForLogin(password);
    if (!passwordResult.isValid && passwordResult.error) {
      setPasswordError(t(passwordResult.error));
      hasError = true;
    }

    if (hasError) return;

    try {
      await signIn(email.trim(), password);
      
      alertService.success(
        t("auth.successTitle"),
        t("auth.signInSuccess")
      );
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = t(localizationKey);
      setLocalError(errorMessage);
    }
  }, [email, password, t, signIn]);

  const handleContinueAnonymously = useCallback(async () => {
    try {
      await continueAnonymously();
    } catch {
      // Silent fail - anonymous mode should always work
    }
  }, [continueAnonymously]);

  const displayError = localError || error;

  return {
    email,
    password,
    emailError,
    passwordError,
    localError,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    handleContinueAnonymously,
    displayError,
  };
}
