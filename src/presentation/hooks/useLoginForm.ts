import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey, resolveErrorMessage } from "../utils/getAuthErrorMessage";
import { validateLoginForm } from "../utils/form/formValidation.util";
import { alertService } from "@umituz/react-native-design-system";
import { useFormFields } from "../utils/form/useFormField.hook";

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

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const clearLocalError = useCallback(() => {
    setLocalError(null);
  }, []);

  const clearFieldErrorsState = useCallback(() => {
    setEmailError(null);
    setPasswordError(null);
    setLocalError(null);
  }, []);

  const { fields, updateField } = useFormFields(
    { email: "", password: "" },
    null,
    { clearLocalError }
  );

  const getErrorMessage = useCallback((key: string) => {
    return resolveErrorMessage(key, translations?.errors);
  }, [translations]);

  const clearErrors = useCallback(() => {
    clearFieldErrorsState();
  }, [clearFieldErrorsState]);

  const handleEmailChange = useCallback(
    (text: string) => {
      updateField("email", text);
      if (emailError || localError) clearFieldErrorsState();
    },
    [updateField, emailError, localError, clearFieldErrorsState]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      updateField("password", text);
      if (passwordError || localError) clearFieldErrorsState();
    },
    [updateField, passwordError, localError, clearFieldErrorsState]
  );

  const handleSignIn = useCallback(async () => {
    clearErrors();

    const validation = validateLoginForm(
      { email: fields.email.trim(), password: fields.password },
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
      await signIn(fields.email.trim(), fields.password);

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
  }, [fields, signIn, translations, getErrorMessage, clearErrors, updateField]);

  const handleContinueAnonymously = useCallback(async () => {
    try {
      await continueAnonymously();
    } catch {
      // Silently fail - anonymous mode is optional
    }
  }, [continueAnonymously]);

  const displayError = localError || error;

  return {
    email: fields.email,
    password: fields.password,
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
