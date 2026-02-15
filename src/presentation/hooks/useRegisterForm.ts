/**
 * Register Form Hook
 * Main hook that combines all register form logic
 */

import { useState, useCallback } from "react";
import { DEFAULT_PASSWORD_CONFIG } from "../../domain/value-objects/AuthConfig";
import { useAuth } from "./useAuth";
import { useFormFields } from "../utils/form/useFormField.hook";
import { usePasswordValidation } from "../utils/form/usePasswordValidation.hook";
import { useRegisterFormHandlers } from "./registerForm/registerFormHandlers";
import { useRegisterFormSubmit } from "./registerForm/registerFormSubmit";
import { useAuthErrorHandler } from "./useAuthErrorHandler";
import { useLocalError } from "./useLocalError";
import type {
  FieldErrors,
  UseRegisterFormConfig,
  UseRegisterFormResult,
} from "./registerForm/useRegisterForm.types";

// Export types for public API
export type { UseRegisterFormConfig, UseRegisterFormResult } from "./registerForm/useRegisterForm.types";

export function useRegisterForm(config?: UseRegisterFormConfig): UseRegisterFormResult {
  const { signUp, loading, error } = useAuth();
  const translations = config?.translations;
  const { handleAuthError, getErrorMessage } = useAuthErrorHandler({ translations: translations?.errors });
  const { localError, setLocalError, clearLocalError } = useLocalError();

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
    handleAuthError,
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
