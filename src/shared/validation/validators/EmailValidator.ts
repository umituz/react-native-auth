/**
 * Email Validator
 * Handles email validation with configurable rules
 */

import type { ValidationResult, ValidatorConfig } from '../types';
import { RegexRule, RequiredRule } from '../rules/ValidationRule';
import { EmailSanitizer } from '../sanitizers/EmailSanitizer';

export class EmailValidator {
  private config: ValidatorConfig;
  private requiredRule: RequiredRule;
  private regexRule: RegexRule;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      emailRegex: config.emailRegex || this.getDefaultEmailRegex(),
      displayNameMinLength: config.displayNameMinLength,
    };

    this.requiredRule = new RequiredRule('Email');
    this.regexRule = new RegexRule(
      this.config.emailRegex!,
      'auth.validation.invalidEmail'
    );
  }

  /**
   * Validate email
   * @param email - Email to validate
   * @returns Validation result
   */
  validate(email: string): ValidationResult {
    // Check required
    const requiredResult = this.requiredRule.validate(email);
    if (!requiredResult.isValid) {
      return requiredResult;
    }

    // Sanitize
    const sanitized = EmailSanitizer.sanitize(email);

    // Check format
    return this.regexRule.validate(sanitized);
  }

  /**
   * Check if email is empty
   */
  isEmpty(email: string | null | undefined): boolean {
    return EmailSanitizer.isEmpty(email);
  }

  private getDefaultEmailRegex(): RegExp {
    // More robust email validation:
    // - Local part: alphanumeric, dots (not consecutive), hyphens, underscores, plus
    // - Domain: alphanumeric and hyphens
    // - TLD: at least 2 characters
    return /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  }
}
