import type { PasswordConfig } from "../../domain/value-objects/AuthConfig";
import { getAuthPackage } from "../services/AuthPackage";

export interface ValidationResult { isValid: boolean; error?: string; }
export interface PasswordStrengthResult extends ValidationResult { requirements: PasswordRequirements; }
export interface PasswordRequirements {
  hasMinLength: boolean; hasUppercase: boolean; hasLowercase: boolean; hasNumber: boolean; hasSpecialChar: boolean;
}
export interface ValidationConfig {
  emailRegex: RegExp; uppercaseRegex: RegExp; lowercaseRegex: RegExp;
  numberRegex: RegExp; specialCharRegex: RegExp; displayNameMinLength: number;
}

const DEFAULT_VAL_CONFIG: ValidationConfig = {
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  uppercaseRegex: /[A-Z]/,
  lowercaseRegex: /[a-z]/,
  numberRegex: /[0-9]/,
  specialCharRegex: /[!@#$%^&*(),.?":{}|<>]/,
  displayNameMinLength: 2,
};

function getValConfig(): ValidationConfig {
  const p = getAuthPackage()?.getConfig();
  return {
    emailRegex: p?.validation.emailRegex || DEFAULT_VAL_CONFIG.emailRegex,
    uppercaseRegex: DEFAULT_VAL_CONFIG.uppercaseRegex,
    lowercaseRegex: DEFAULT_VAL_CONFIG.lowercaseRegex,
    numberRegex: DEFAULT_VAL_CONFIG.numberRegex,
    specialCharRegex: DEFAULT_VAL_CONFIG.specialCharRegex,
    displayNameMinLength: DEFAULT_VAL_CONFIG.displayNameMinLength,
  };
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") return { isValid: false, error: "auth.validation.emailRequired" };
  if (!getValConfig().emailRegex.test(email.trim())) return { isValid: false, error: "auth.validation.invalidEmail" };
  return { isValid: true };
}

export function validatePasswordForLogin(password: string): ValidationResult {
  if (!password || password.length === 0) return { isValid: false, error: "auth.validation.passwordRequired" };
  return { isValid: true };
}

export function validatePasswordForRegister(password: string, config: PasswordConfig): PasswordStrengthResult {
  const v = getValConfig();
  const req: PasswordRequirements = {
    hasMinLength: password.length >= config.minLength,
    hasUppercase: !config.requireUppercase || v.uppercaseRegex.test(password),
    hasLowercase: !config.requireLowercase || v.lowercaseRegex.test(password),
    hasNumber: !config.requireNumber || v.numberRegex.test(password),
    hasSpecialChar: !config.requireSpecialChar || v.specialCharRegex.test(password),
  };

  if (!password) return { isValid: false, error: "auth.validation.passwordRequired", requirements: req };
  if (!req.hasMinLength) return { isValid: false, error: "auth.validation.passwordTooShort", requirements: req };
  if (config.requireUppercase && !req.hasUppercase) return { isValid: false, error: "auth.validation.passwordRequireUppercase", requirements: req };
  if (config.requireLowercase && !req.hasLowercase) return { isValid: false, error: "auth.validation.passwordRequireLowercase", requirements: req };
  if (config.requireNumber && !req.hasNumber) return { isValid: false, error: "auth.validation.passwordRequireNumber", requirements: req };
  if (config.requireSpecialChar && !req.hasSpecialChar) return { isValid: false, error: "auth.validation.passwordRequireSpecialChar", requirements: req };

  return { isValid: true, requirements: req };
}

export function validatePasswordConfirmation(password: string, confirm: string): ValidationResult {
  if (!confirm) return { isValid: false, error: "auth.validation.confirmPasswordRequired" };
  if (password !== confirm) return { isValid: false, error: "auth.validation.passwordsDoNotMatch" };
  return { isValid: true };
}

export function validateDisplayName(name: string, minLength?: number): ValidationResult {
  if (!name || name.trim() === "") return { isValid: false, error: "auth.validation.nameRequired" };
  if (name.trim().length < (minLength ?? getValConfig().displayNameMinLength)) return { isValid: false, error: "auth.validation.nameTooShort" };
  return { isValid: true };
}
