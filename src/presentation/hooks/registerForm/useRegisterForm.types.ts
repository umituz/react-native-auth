/**
 * Register Form Types
 * Type definitions for register form hook
 */

export type FieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export interface RegisterFormTranslations {
  successTitle: string;
  signUpSuccess: string;
  errors: Record<string, string>;
}

export interface UseRegisterFormConfig {
  translations: RegisterFormTranslations;
}

export interface UseRegisterFormResult {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fieldErrors: FieldErrors;
  localError: string | null;
  loading: boolean;
  passwordRequirements: { hasMinLength: boolean };
  passwordsMatch: boolean;
  handleDisplayNameChange: (text: string) => void;
  handleEmailChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;
  handleSignUp: () => Promise<void>;
  displayError: string | null;
}
