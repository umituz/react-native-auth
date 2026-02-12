/**
 * Register Form Submit Logic
 * Handles form validation and sign-up submission
 */

import { useCallback } from "react";
import { alertService } from "@umituz/react-native-design-system";
import { DEFAULT_PASSWORD_CONFIG } from "../../../domain/value-objects/AuthConfig";
import {
  validateRegisterForm,
  errorsToFieldErrors,
} from "../../utils/form/formValidation.util";
import { getAuthErrorLocalizationKey } from "../../utils/getAuthErrorMessage";
import type { FieldErrors, RegisterFormTranslations } from "./useRegisterForm.types";

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
  translations?: RegisterFormTranslations
) {
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
  }, [fields, signUp, translations, getErrorMessage, clearFormErrors, setFieldErrors, setLocalError]);

  return { handleSignUp };
}
