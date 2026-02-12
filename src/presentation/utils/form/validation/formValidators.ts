/**
 * Form Validators
 * Validation functions for different auth forms
 */

import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../../../../infrastructure/utils/AuthValidation";
import type { PasswordConfig } from "../../../../domain/value-objects/AuthConfig";
import type {
  FormValidationResult,
  LoginFormValues,
  RegisterFormValues,
  ProfileFormValues,
  FormValidationError,
} from "./formValidation.types";

export function validateLoginForm(
  values: LoginFormValues,
  getErrorMessage: (key: string) => string
): FormValidationResult {
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

export function validateProfileForm(
  values: ProfileFormValues,
  getErrorMessage: (key: string) => string
): FormValidationResult {
  const errors: FormValidationError[] = [];

  if (!values.displayName || !values.displayName.trim()) {
    errors.push({
      field: "displayName",
      message: getErrorMessage("auth.validation.displayNameRequired"),
    });
  }

  if (values.email) {
    const emailResult = validateEmail(values.email.trim());
    if (!emailResult.isValid && emailResult.error) {
      errors.push({ field: "email", message: getErrorMessage(emailResult.error) });
    }
  }

  return { isValid: errors.length === 0, errors };
}
