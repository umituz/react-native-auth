import type { PasswordConfig } from "../../domain/value-objects/AuthConfig";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordStrengthResult extends ValidationResult { requirements: PasswordRequirements; }
export interface PasswordRequirements {
  hasMinLength: boolean;
}

export interface ValidationConfig {
  emailRegex: RegExp;
  displayNameMinLength: number;
}

export const DEFAULT_VAL_CONFIG: ValidationConfig = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  displayNameMinLength: 2,
};

export function validateEmail(
  email: string,
  config: ValidationConfig = DEFAULT_VAL_CONFIG
): ValidationResult {
  if (!email || email.trim() === "") return { isValid: false, error: "auth.validation.emailRequired" };
  if (!config.emailRegex.test(email.trim())) return { isValid: false, error: "auth.validation.invalidEmail" };
  return { isValid: true };
}

export function validatePasswordForLogin(password: string): ValidationResult {
  if (!password || password.length === 0) return { isValid: false, error: "auth.validation.passwordRequired" };
  return { isValid: true };
}

export function validatePasswordForRegister(
  password: string,
  config: PasswordConfig,
): PasswordStrengthResult {
  if (!password) {
    return { isValid: false, error: "auth.validation.passwordRequired", requirements: { hasMinLength: false } };
  }

  const req: PasswordRequirements = {
    hasMinLength: password.length >= config.minLength,
  };

  if (!req.hasMinLength) return { isValid: false, error: "auth.validation.passwordTooShort", requirements: req };

  return { isValid: true, requirements: req };
}

export function validatePasswordConfirmation(password: string, confirm: string): ValidationResult {
  if (!confirm) return { isValid: false, error: "auth.validation.confirmPasswordRequired" };
  if (password !== confirm) return { isValid: false, error: "auth.validation.passwordsDoNotMatch" };
  return { isValid: true };
}

export function validateDisplayName(
  name: string,
  minLength: number = DEFAULT_VAL_CONFIG.displayNameMinLength
): ValidationResult {
  if (!name || name.trim() === "") return { isValid: false, error: "auth.validation.nameRequired" };
  if (name.trim().length < minLength) return { isValid: false, error: "auth.validation.nameTooShort" };
  return { isValid: true };
}
