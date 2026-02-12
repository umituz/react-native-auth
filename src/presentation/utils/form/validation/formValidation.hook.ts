/**
 * Form Validation Hook
 * React hook for form validation
 */

import { useCallback } from "react";
import type { PasswordConfig } from "../../../../domain/value-objects/AuthConfig";
import type { LoginFormValues, RegisterFormValues, ProfileFormValues } from "./formValidation.types";
import { validateLoginForm, validateRegisterForm, validateProfileForm } from "./formValidators";
import { errorsToFieldErrors } from "./formValidation.utils";

export function useFormValidation(getErrorMessage: (key: string) => string) {
  const validateLogin = useCallback(
    (values: LoginFormValues) => validateLoginForm(values, getErrorMessage),
    [getErrorMessage]
  );

  const validateRegister = useCallback(
    (values: RegisterFormValues, passwordConfig: PasswordConfig) =>
      validateRegisterForm(values, getErrorMessage, passwordConfig),
    [getErrorMessage]
  );

  const validateProfile = useCallback(
    (values: ProfileFormValues) => validateProfileForm(values, getErrorMessage),
    [getErrorMessage]
  );

  return { validateLogin, validateRegister, validateProfile, errorsToFieldErrors };
}
