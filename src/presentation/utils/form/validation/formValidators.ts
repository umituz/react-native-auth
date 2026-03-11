/**
 * Form Validators
 * Validation functions for different auth forms
 */

import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../../../../application/services/ValidationService";
import type { PasswordConfig } from "../../../../domain/value-objects/AuthConfig";
import type {
  FormValidationResult,
  LoginFormValues,
  RegisterFormValues,
  ProfileFormValues,
  FormValidationError,
} from "./formValidation.types";
import { sanitizeName } from "../../../../infrastructure/utils/validation/sanitization";

/**
 * Validate login form values.
 * IMPORTANT: Callers must sanitize email before passing to this function.
 */
export function validateLoginForm(
  values: LoginFormValues,
  getErrorMessage: (key: string) => string
): FormValidationResult {
  const errors: FormValidationError[] = [];

  const emailResult = validateEmail(values.email);
  if (!emailResult.isValid && emailResult.error) {
    errors.push({ field: "email", message: getErrorMessage(emailResult.error) });
  }

  const passwordResult = validatePasswordForLogin(values.password);
  if (!passwordResult.isValid && passwordResult.error) {
    errors.push({ field: "password", message: getErrorMessage(passwordResult.error) });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate register form values.
 * IMPORTANT: Callers must sanitize email before passing to this function.
 */
export function validateRegisterForm(
  values: RegisterFormValues,
  getErrorMessage: (key: string) => string,
  passwordConfig: PasswordConfig
): FormValidationResult {
  const errors: FormValidationError[] = [];

  const emailResult = validateEmail(values.email);
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

/**
 * Validate profile form values.
 * Email should be pre-sanitized by caller if provided.
 */
export function validateProfileForm(
  values: ProfileFormValues,
  getErrorMessage: (key: string) => string
): FormValidationResult {
  const errors: FormValidationError[] = [];

  if (!values.displayName || !sanitizeName(values.displayName)) {
    errors.push({
      field: "displayName",
      message: getErrorMessage("auth.validation.displayNameRequired"),
    });
  }

  if (values.email) {
    const emailResult = validateEmail(values.email);
    if (!emailResult.isValid && emailResult.error) {
      errors.push({ field: "email", message: getErrorMessage(emailResult.error) });
    }
  }

  return { isValid: errors.length === 0, errors };
}
