/**
 * Validation Rule
 * Base class and common validation rules
 */

import type { ValidationResult } from '../types';

export abstract class BaseValidationRule<T = unknown> {
  abstract validate(value: T): ValidationResult;
}

/**
 * Required field validation rule
 */
export class RequiredRule extends BaseValidationRule<string | null | undefined> {
  constructor(private fieldName: string = 'Field') {
    super();
  }

  validate(value: string | null | undefined): ValidationResult {
    if (!value || value.trim() === '') {
      return { isValid: false, error: `auth.validation.${this.thisFieldNameToKey()}.required` };
    }
    return { isValid: true };
  }

  private thisFieldNameToKey(): string {
    const keyMap: Record<string, string> = {
      'Field': 'field',
      'Email': 'email',
      'Password': 'password',
      'Name': 'name',
    };
    return keyMap[this.fieldName] || 'field';
  }
}

/**
 * Regex validation rule
 */
export class RegexRule extends BaseValidationRule<string> {
  constructor(
    private regex: RegExp,
    private errorKey: string
  ) {
    super();
  }

  validate(value: string): ValidationResult {
    if (!this.regex.test(value)) {
      return { isValid: false, error: this.errorKey };
    }
    return { isValid: true };
  }
}

/**
 * Min length validation rule
 */
export class MinLengthRule extends BaseValidationRule<string> {
  constructor(private minLength: number, private errorKey: string) {
    super();
  }

  validate(value: string): ValidationResult {
    if (value.length < this.minLength) {
      return { isValid: false, error: this.errorKey };
    }
    return { isValid: true };
  }
}
