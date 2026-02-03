/**
 * Change Password Screen Types
 */

export interface ChangePasswordTranslations {
  title: string;
  description: string;
  currentPassword: string;
  enterCurrentPassword: string;
  newPassword: string;
  enterNewPassword: string;
  confirmPassword: string;
  enterConfirmPassword: string;
  requirements: string;
  minLength: string;
  uppercase: string;
  lowercase: string;
  number: string;
  specialChar: string;
  passwordsMatch: string;
  changePassword: string;
  changing: string;
  cancel: string;
  success: string;
  error: string;
  fillAllFields: string;
  unauthorized: string;
  signInFailed: string;
}

export interface ChangePasswordScreenProps {
  translations: ChangePasswordTranslations;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface PasswordValidation {
  isLengthValid: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  passwordsMatch: boolean;
  isValid: boolean;
}

export function validatePassword(
  newPassword: string,
  confirmPassword: string,
  currentPassword: string
): PasswordValidation {
  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const isValid =
    isLengthValid &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    passwordsMatch &&
    currentPassword.length > 0;

  return {
    isLengthValid,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    passwordsMatch,
    isValid,
  };
}
