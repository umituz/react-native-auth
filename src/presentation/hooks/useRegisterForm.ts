import { useState, useCallback } from "react";
import { DEFAULT_PASSWORD_CONFIG } from "../../domain/value-objects/AuthConfig";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey, resolveErrorMessage } from "../utils/getAuthErrorMessage";
import { validateRegisterForm, errorsToFieldErrors } from "../utils/form/formValidation.util";
import { alertService } from "@umituz/react-native-design-system";
import { useFormFields } from "../utils/form/useFormField.hook";
import { usePasswordValidation } from "../utils/form/usePasswordValidation.hook";
import { clearFieldError, clearFieldErrors } from "../utils/form/formErrorUtils";

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
  passwordRequirements: { hasMinLength: boolean };
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

  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearLocalError = useCallback(() => {
    setLocalError(null);
  }, []);

  const clearFormErrors = useCallback(() => {
    setLocalError(null);
    setFieldErrors({});
  }, []);

  const { fields, updateField } = useFormFields(
    {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    setFieldErrors,
    { clearLocalError }
  );

  const getErrorMessage = useCallback((key: string) => {
    return resolveErrorMessage(key, translations?.errors);
  }, [translations]);

  const { passwordRequirements, passwordsMatch } = usePasswordValidation(
    fields.password,
    fields.confirmPassword,
    { passwordConfig: DEFAULT_PASSWORD_CONFIG }
  );

  const handleDisplayNameChange = useCallback(
    (text: string) => {
      updateField("displayName", text);
      clearFieldError(setFieldErrors, "displayName");
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      updateField("email", text);
      clearFieldError(setFieldErrors, "email");
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      updateField("password", text);
      clearFieldErrors(setFieldErrors, ["password", "confirmPassword"]);
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      updateField("confirmPassword", text);
      clearFieldError(setFieldErrors, "confirmPassword");
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handleSignUp = useCallback(async () => {
    clearFormErrors();

    const validation = validateRegisterForm(
      {
        displayName: fields.displayName.trim() || undefined,
        email: fields.email.trim(),
        password: fields.password,
        confirmPassword: fields.confirmPassword,
      },
      getErrorMessage,
      DEFAULT_PASSWORD_CONFIG
    );

    if (!validation.isValid) {
      setFieldErrors(errorsToFieldErrors(validation.errors));
      return;
    }

    try {
      await signUp(fields.email.trim(), fields.password, fields.displayName.trim() || undefined);

      if (translations) {
        alertService.success(translations.successTitle, translations.signUpSuccess);
      }
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      setLocalError(getErrorMessage(localizationKey));
    }
  }, [fields, signUp, translations, getErrorMessage, clearFormErrors, updateField]);

  const displayError = localError || error;

  return {
    displayName: fields.displayName,
    email: fields.email,
    password: fields.password,
    confirmPassword: fields.confirmPassword,
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
