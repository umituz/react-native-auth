import { useState, useCallback, useMemo } from "react";
import {
  validateEmail,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../../infrastructure/utils/AuthValidation";
import { DEFAULT_PASSWORD_CONFIG } from "../../domain/value-objects/AuthConfig";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";
import type { PasswordRequirements } from "../../infrastructure/utils/AuthValidation";
import { alertService } from "@umituz/react-native-design-system";

export interface RegisterFormTranslations {
  successTitle: string;
  signUpSuccess: string;
  errors: Record<string, string>;
}

export interface UseRegisterFormConfig {
  translations: RegisterFormTranslations;
}

export interface UseRegisterFormResult {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fieldErrors: {
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  localError: string | null;
  loading: boolean;
  passwordRequirements: PasswordRequirements;
  passwordsMatch: boolean;
  handleDisplayNameChange: (text: string) => void;
  handleEmailChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;
  handleSignUp: () => Promise<void>;
  displayError: string | null;
}

export function useRegisterForm(config?: UseRegisterFormConfig): UseRegisterFormResult {
  const { signUp, loading, error } = useAuth();
  const translations = config?.translations;

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

  const getErrorMessage = useCallback((key: string) => {
    return translations?.errors?.[key] || key;
  }, [translations]);

  const passwordRequirements = useMemo((): PasswordRequirements => {
    if (!password) {
      return { hasMinLength: false };
    }
    const result = validatePasswordForRegister(password, DEFAULT_PASSWORD_CONFIG);
    return result.requirements;
  }, [password]);

  const passwordsMatch = useMemo(() => {
    return password.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const handleDisplayNameChange = useCallback((text: string) => {
    setDisplayName(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.displayName) delete next.displayName;
      return next;
    });
    setLocalError(null);
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.email) delete next.email;
      return next;
    });
    setLocalError(null);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.password) delete next.password;
      if (next.confirmPassword) delete next.confirmPassword;
      return next;
    });
    setLocalError(null);
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.confirmPassword) delete next.confirmPassword;
      return next;
    });
    setLocalError(null);
  }, []);

  const handleSignUp = useCallback(async () => {
    setLocalError(null);
    setFieldErrors({});

    const emailResult = validateEmail(email.trim());
    if (!emailResult.isValid && emailResult.error) {
      setFieldErrors((prev) => ({ ...prev, email: getErrorMessage(emailResult.error as string) }));
      return;
    }

    const passwordResult = validatePasswordForRegister(password, DEFAULT_PASSWORD_CONFIG);
    if (!passwordResult.isValid && passwordResult.error) {
      setFieldErrors((prev) => ({ ...prev, password: getErrorMessage(passwordResult.error as string) }));
      return;
    }

    const confirmResult = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmResult.isValid && confirmResult.error) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: getErrorMessage(confirmResult.error as string) }));
      return;
    }

    try {
      await signUp(email.trim(), password, displayName.trim() || undefined);

      if (translations) {
        alertService.success(translations.successTitle, translations.signUpSuccess);
      }
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = getErrorMessage(localizationKey);
      setLocalError(errorMessage);
    }
  }, [displayName, email, password, confirmPassword, signUp, translations, getErrorMessage]);

  const displayError = localError || error;

  return {
    displayName,
    email,
    password,
    confirmPassword,
    fieldErrors,
    localError,
    loading,
    passwordRequirements,
    passwordsMatch,
    handleDisplayNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSignUp,
    displayError,
  };
}
