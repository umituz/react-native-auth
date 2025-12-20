/**
 * useLoginForm Hook
 * Single Responsibility: Handle login form logic
 */

import { useState, useCallback } from "react";
import { useLocalization } from "@umituz/react-native-localization";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";
import { validateEmail } from "../../infrastructure/utils/AuthValidation";

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
  handleContinueAsGuest: () => Promise<void>;
  displayError: string | null;
}

export function useLoginForm(): UseLoginFormResult {
  const { t } = useLocalization();
  const { signIn, loading, error, continueAsGuest } = useAuth();

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
    if (!emailResult.isValid) {
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
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = t(localizationKey);
      setLocalError(errorMessage);
    }
  }, [email, password, t, signIn]);

  const handleContinueAsGuest = useCallback(async () => {
    try {
      await continueAsGuest();
    } catch {
      // Silent fail - guest mode should always work
    }
  }, [continueAsGuest]);

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
    handleContinueAsGuest,
    displayError,
  };
}
