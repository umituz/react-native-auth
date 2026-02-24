/**
 * Register Form Submit Logic
 * Handles form validation and sign-up submission
 */

import { useCallback } from "react";
import { alertService } from "@umituz/react-native-design-system/molecules";
import { DEFAULT_PASSWORD_CONFIG } from "../../../domain/value-objects/AuthConfig";
import {
  validateRegisterForm,
  errorsToFieldErrors,
} from "../../utils/form/formValidation.util";
import type { FieldErrors, RegisterFormTranslations } from "./useRegisterForm.types";
import { sanitizeEmail, sanitizeName } from "../../../infrastructure/utils/validation/sanitization";

interface RegisterFormFields {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useRegisterFormSubmit(
  fields: RegisterFormFields,
  signUp: (email: string, password: string, displayName?: string) => Promise<void>,
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setLocalError: React.Dispatch<React.SetStateAction<string | null>>,
  clearFormErrors: () => void,
  getErrorMessage: (key: string) => string,
  handleAuthError: (error: unknown) => string,
  translations?: RegisterFormTranslations
) {
  const handleSignUp = useCallback(async () => {
    clearFormErrors();

    const validation = validateRegisterForm(
      {
        displayName: sanitizeName(fields.displayName) || undefined,
        email: sanitizeEmail(fields.email),
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
      await signUp(sanitizeEmail(fields.email), fields.password, sanitizeName(fields.displayName) || undefined);

      if (translations) {
        alertService.success(translations.successTitle, translations.signUpSuccess);
      }
    } catch (err: unknown) {
      setLocalError(handleAuthError(err));
    }
  }, [fields, signUp, translations, handleAuthError, getErrorMessage, clearFormErrors, setFieldErrors, setLocalError]);

  return { handleSignUp };
}
