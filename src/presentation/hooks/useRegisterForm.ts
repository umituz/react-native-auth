/**
 * Register Form Hook
 * Main hook that combines all register form logic
 */

import { useState, useCallback } from "react";
import { DEFAULT_PASSWORD_CONFIG } from "../../domain/value-objects/AuthConfig";
import { useAuth } from "./useAuth";
import { resolveErrorMessage } from "../utils/getAuthErrorMessage";
import { useFormFields } from "../utils/form/useFormField.hook";
import { usePasswordValidation } from "../utils/form/usePasswordValidation.hook";
import { useRegisterFormHandlers } from "./registerForm/registerFormHandlers";
import { useRegisterFormSubmit } from "./registerForm/registerFormSubmit";
import type {
  FieldErrors,
  UseRegisterFormConfig,
  UseRegisterFormResult,
} from "./registerForm/useRegisterForm.types";

// Re-export types for backward compatibility
export type { FieldErrors, RegisterFormTranslations, UseRegisterFormConfig, UseRegisterFormResult } from "./registerForm/useRegisterForm.types";

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

  const getErrorMessage = useCallback(
    (key: string) => {
      return resolveErrorMessage(key, translations?.errors);
    },
    [translations]
  );

  const { passwordRequirements, passwordsMatch } = usePasswordValidation(
    fields.password,
    fields.confirmPassword,
    { passwordConfig: DEFAULT_PASSWORD_CONFIG }
  );

  const handlers = useRegisterFormHandlers(updateField, setFieldErrors, clearLocalError);

  const { handleSignUp } = useRegisterFormSubmit(
    fields,
    signUp,
    setFieldErrors,
    setLocalError,
    clearFormErrors,
    getErrorMessage,
    translations
  );

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
    ...handlers,
    handleSignUp,
    displayError,
  };
}
