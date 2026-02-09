import { useState, useCallback, useMemo } from "react";
import {
  validatePasswordForRegister,
  type PasswordRequirements,
} from "../../infrastructure/utils/AuthValidation";
import { DEFAULT_PASSWORD_CONFIG } from "../../domain/value-objects/AuthConfig";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey, resolveErrorMessage } from "../utils/getAuthErrorMessage";
import { validateRegisterForm, errorsToFieldErrors } from "../utils/form/formValidation.util";
import { alertService } from "@umituz/react-native-design-system";
import { clearFieldErrors, clearFieldError } from "../utils/form/formErrorUtils";

export type FieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

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
  fieldErrors: FieldErrors;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const getErrorMessage = useCallback((key: string) => {
    return resolveErrorMessage(key, translations?.errors);
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

  const clearFormErrors = useCallback(() => {
    setLocalError(null);
    setFieldErrors({});
  }, []);

  const handleDisplayNameChange = useCallback((text: string) => {
    setDisplayName(text);
    clearFieldError(setFieldErrors, "displayName");
    if (localError) setLocalError(null);
  }, [localError]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    clearFieldError(setFieldErrors, "email");
    if (localError) setLocalError(null);
  }, [localError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    clearFieldErrors(setFieldErrors, ["password", "confirmPassword"]);
    if (localError) setLocalError(null);
  }, [localError]);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
    clearFieldError(setFieldErrors, "confirmPassword");
    if (localError) setLocalError(null);
  }, [localError]);

  const handleSignUp = useCallback(async () => {
    clearFormErrors();

    const validation = validateRegisterForm(
      {
        displayName: displayName.trim() || undefined,
        email: email.trim(),
        password,
        confirmPassword,
      },
      getErrorMessage,
      DEFAULT_PASSWORD_CONFIG
    );

    if (!validation.isValid) {
      setFieldErrors(errorsToFieldErrors(validation.errors));
      return;
    }

    try {
      await signUp(email.trim(), password, displayName.trim() || undefined);

      if (translations) {
        alertService.success(translations.successTitle, translations.signUpSuccess);
      }
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      setLocalError(getErrorMessage(localizationKey));
    }
  }, [displayName, email, password, confirmPassword, signUp, translations, getErrorMessage, clearFormErrors]);

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
