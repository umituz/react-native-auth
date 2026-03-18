/**
 * Name Validator
 * Handles display name validation
 */

import type { ValidationResult, ValidatorConfig } from '../types';
import { MinLengthRule, RequiredRule } from '../rules/ValidationRule';
import { NameSanitizer } from '../sanitizers/NameSanitizer';

export class NameValidator {
  private config: ValidatorConfig;
  private requiredRule: RequiredRule;
  private minLengthRule: MinLengthRule;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      displayNameMinLength: config.displayNameMinLength || 2,
    };

    this.requiredRule = new RequiredRule('Name');
    this.minLengthRule = new MinLengthRule(
      this.config.displayNameMinLength,
      'auth.validation.nameTooShort'
    );
  }

  /**
   * Validate display name
   * @param name - Name to validate
   * @returns Validation result
   */
  validate(name: string): ValidationResult {
    // Check required
    const requiredResult = this.requiredRule.validate(name);
    if (!requiredResult.isValid) {
      return { isValid: false, error: 'auth.validation.nameRequired' };
    }

    // Sanitize
    const sanitized = NameSanitizer.sanitize(name);

    // Check min length
    return this.minLengthRule.validate(sanitized);
  }

  /**
   * Check if name is empty
   */
  isEmpty(name: string | null | undefined): boolean {
    return NameSanitizer.isEmpty(name);
  }
}
