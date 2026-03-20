import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { validateLoginForm } from "../utils/form/validation/formValidators";
import { AlertService } from "@umituz/react-native-design-system/molecules";
import { useFormFields } from "../utils/form/useFormField.hook";
import { sanitizeEmail } from "../../infrastructure/utils/validation/sanitization";
import { useAuthErrorHandler } from "./useAuthErrorHandler";
import { useLocalError } from "./useLocalError";
import { extractFieldError } from "../../infrastructure/utils/calculators/formErrorCollection";

interface LoginFormTranslations {
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
  const { handleAuthError, getErrorMessage } = useAuthErrorHandler({ translations: translations?.errors });
  const { localError, setLocalError, clearLocalError } = useLocalError();

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const clearFieldErrorsState = useCallback(() => {
    setEmailError(null);
    setPasswordError(null);
    setLocalError(null);
  }, [setLocalError, setEmailError, setPasswordError]);

  const { fields, updateField } = useFormFields(
    { email: "", password: "" },
    { clearLocalError }
  );

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
    clearFieldErrorsState();

    // Sanitize once, use for both validation and sign-in
    const sanitizedEmail = sanitizeEmail(fields.email);

    const validation = validateLoginForm(
      { email: sanitizedEmail, password: fields.password },
      getErrorMessage
    );

    if (!validation.isValid) {
      // Use utility to collect field errors
      setEmailError(extractFieldError(validation.errors, "email"));
      setPasswordError(extractFieldError(validation.errors, "password"));
      return;
    }

    try {
      await signIn(sanitizedEmail, fields.password);

      if (translations) {
        AlertService.success(
          translations.successTitle,
          translations.signInSuccess
        );
      }
    } catch (err: unknown) {
      setLocalError(handleAuthError(err));
    }
  }, [
    fields.email,
    fields.password,
    signIn,
    translations,
    handleAuthError,
    getErrorMessage,
    clearFieldErrorsState,
    setLocalError,
  ]);

  const handleContinueAnonymously = useCallback(async () => {
    try {
      await continueAnonymously();
    } catch (err: unknown) {
      setLocalError(handleAuthError(err));
    }
  }, [continueAnonymously, handleAuthError]);

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
