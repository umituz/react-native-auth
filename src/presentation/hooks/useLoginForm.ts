import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";
import { validateEmail, validatePasswordForLogin } from "../../infrastructure/utils/AuthValidation";
import { alertService } from "@umituz/react-native-design-system";

export interface LoginFormTranslations {
  successTitle: string;
  signInSuccess: string;
  errors: Record<string, string>;
}

export interface UseLoginFormConfig {
  translations: LoginFormTranslations;
}

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

export function useLoginForm(config?: UseLoginFormConfig): UseLoginFormResult {
  const { signIn, loading, error, continueAnonymously } = useAuth();
  const translations = config?.translations;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const getErrorMessage = useCallback((key: string) => {
    return translations?.errors?.[key] || key;
  }, [translations]);

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
      setEmailError(getErrorMessage(emailResult.error));
      hasError = true;
    }

    const passwordResult = validatePasswordForLogin(password);
    if (!passwordResult.isValid && passwordResult.error) {
      setPasswordError(getErrorMessage(passwordResult.error));
      hasError = true;
    }

    if (hasError) return;

    try {
      await signIn(email.trim(), password);

      if (translations) {
        alertService.success(
          translations.successTitle,
          translations.signInSuccess
        );
      }
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = getErrorMessage(localizationKey);
      setLocalError(errorMessage);
    }
  }, [email, password, signIn, translations, getErrorMessage]);

  const handleContinueAnonymously = useCallback(async () => {
    try {
      await continueAnonymously();
    } catch {
      // Silent fail
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
