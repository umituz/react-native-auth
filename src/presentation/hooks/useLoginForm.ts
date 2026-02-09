import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey, resolveErrorMessage } from "../utils/getAuthErrorMessage";
import { validateLoginForm } from "../utils/form/formValidation.util";
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
    return resolveErrorMessage(key, translations?.errors);
  }, [translations]);

  const clearErrors = useCallback(() => {
    setEmailError(null);
    setPasswordError(null);
    setLocalError(null);
  }, []);

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      if (emailError || localError) clearErrors();
    },
    [emailError, localError, clearErrors],
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (passwordError || localError) clearErrors();
    },
    [passwordError, localError, clearErrors],
  );

  const handleSignIn = useCallback(async () => {
    clearErrors();

    const validation = validateLoginForm(
      { email: email.trim(), password },
      getErrorMessage
    );

    if (!validation.isValid) {
      for (const error of validation.errors) {
        if (error.field === "email") setEmailError(error.message);
        if (error.field === "password") setPasswordError(error.message);
      }
      return;
    }

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
      setLocalError(getErrorMessage(localizationKey));
    }
  }, [email, password, signIn, translations, getErrorMessage, clearErrors]);

  const handleContinueAnonymously = useCallback(async () => {
    try {
      await continueAnonymously();
    } catch {
      // Silently fail - anonymous mode is optional
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
