/**
 * Password Validator
 * Handles password validation with strength requirements
 */

import type { PasswordStrengthResult, ValidationResult } from '../types';
import { RequiredRule } from '../rules/ValidationRule';
import { PasswordSanitizer } from '../sanitizers/PasswordSanitizer';

export interface PasswordConfig {
  minLength: number;
}

export class PasswordValidator {
  private config: PasswordConfig;
  private requiredRule: RequiredRule;

  constructor(config: PasswordConfig) {
    this.config = config;
    this.requiredRule = new RequiredRule('Password');
  }

  /**
   * Validate password for login (just check required)
   * @param password - Password to validate
   * @returns Validation result
   */
  validateForLogin(password: string): ValidationResult {
    // Don't trim passwords - whitespace may be intentional
    if (PasswordSanitizer.isEmpty(password)) {
      return { isValid: false, error: 'auth.validation.passwordRequired' };
    }
    return { isValid: true };
  }

  /**
   * Validate password for registration (check requirements)
   * @param password - Password to validate
   * @returns Password strength result
   */
  validateForRegister(password: string): PasswordStrengthResult {
    // Don't trim passwords - whitespace may be intentional
    if (PasswordSanitizer.isEmpty(password)) {
      return {
        isValid: false,
        error: 'auth.validation.passwordRequired',
        requirements: { hasMinLength: false },
      };
    }

    const hasMinLength = password.length >= this.config.minLength;

    if (!hasMinLength) {
      return {
        isValid: false,
        error: 'auth.validation.passwordTooShort',
        requirements: { hasMinLength: false },
      };
    }

    return {
      isValid: true,
      requirements: { hasMinLength: true },
    };
  }

  /**
   * Validate password confirmation matches
   * @param password - Original password
   * @param confirm - Confirmation password
   * @returns Validation result
   */
  validateConfirmation(password: string, confirm: string): ValidationResult {
    // Don't trim passwords - whitespace may be intentional
    if (PasswordSanitizer.isEmpty(confirm)) {
      return { isValid: false, error: 'auth.validation.confirmPasswordRequired' };
    }

    if (password !== confirm) {
      return { isValid: false, error: 'auth.validation.passwordsDoNotMatch' };
    }

    return { isValid: true };
  }

  /**
   * Check if password is empty
   */
  isEmpty(password: string | null | undefined): boolean {
    return PasswordSanitizer.isEmpty(password);
  }
}
