/**
 * Form Validation Utilities
 * Shared validation logic for all auth forms
 */

import { useCallback } from "react";
import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../../../infrastructure/utils/AuthValidation";
import type { PasswordConfig } from "../../../domain/value-objects/AuthConfig";

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  displayName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormValues {
  displayName: string;
  email: string;
}

export function validateLoginForm(values: LoginFormValues, getErrorMessage: (key: string) => string): FormValidationResult {
  const errors: FormValidationError[] = [];

  const emailResult = validateEmail(values.email.trim());
  if (!emailResult.isValid && emailResult.error) {
    errors.push({ field: "email", message: getErrorMessage(emailResult.error) });
  }

  const passwordResult = validatePasswordForLogin(values.password);
  if (!passwordResult.isValid && passwordResult.error) {
    errors.push({ field: "password", message: getErrorMessage(passwordResult.error) });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateRegisterForm(
  values: RegisterFormValues,
  getErrorMessage: (key: string) => string,
  passwordConfig: PasswordConfig
): FormValidationResult {
  const errors: FormValidationError[] = [];

  const emailResult = validateEmail(values.email.trim());
  if (!emailResult.isValid && emailResult.error) {
    errors.push({ field: "email", message: getErrorMessage(emailResult.error) });
  }

  const passwordResult = validatePasswordForRegister(values.password, passwordConfig);
  if (!passwordResult.isValid && passwordResult.error) {
    errors.push({ field: "password", message: getErrorMessage(passwordResult.error) });
  }

  const confirmResult = validatePasswordConfirmation(values.password, values.confirmPassword);
  if (!confirmResult.isValid && confirmResult.error) {
    errors.push({ field: "confirmPassword", message: getErrorMessage(confirmResult.error) });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateProfileForm(values: ProfileFormValues): FormValidationResult {
  const errors: FormValidationError[] = [];

  if (!values.displayName.trim()) {
    errors.push({ field: "displayName", message: "Display name is required" });
  }

  if (values.email) {
    const emailResult = validateEmail(values.email);
    if (!emailResult.isValid && emailResult.error) {
      errors.push({ field: "email", message: emailResult.error });
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function errorsToFieldErrors(errors: FormValidationError[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const error of errors) {
    result[error.field] = error.message;
  }
  return result;
}

export function useFormValidation(getErrorMessage: (key: string) => string) {
  const validateLogin = useCallback((values: LoginFormValues) => validateLoginForm(values, getErrorMessage), [getErrorMessage]);
  const validateRegister = useCallback(
    (values: RegisterFormValues, passwordConfig: PasswordConfig) => validateRegisterForm(values, getErrorMessage, passwordConfig),
    [getErrorMessage]
  );
  const validateProfile = useCallback((values: ProfileFormValues) => validateProfileForm(values), []);

  return { validateLogin, validateRegister, validateProfile, errorsToFieldErrors };
}
