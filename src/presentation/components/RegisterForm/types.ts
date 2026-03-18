/**
 * Register Form Types
 */

import type { AuthLegalLinksTranslations } from '../AuthLegalLinks';
import type { PasswordStrengthTranslations } from '../PasswordStrengthIndicator';
import type { PasswordMatchTranslations } from '../PasswordMatchIndicator';

export interface RegisterFormTranslations {
  displayName: string;
  displayNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  signUp: string;
  alreadyHaveAccount: string;
  signIn: string;
  bySigningUp: string;
  legal: AuthLegalLinksTranslations;
  passwordStrength: PasswordStrengthTranslations;
  passwordMatch: PasswordMatchTranslations;
}

export interface RegisterFormProps {
  translations: RegisterFormTranslations;
  onNavigateToLogin: () => void;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}
