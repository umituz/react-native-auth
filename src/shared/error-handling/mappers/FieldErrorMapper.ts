/**
 * Field Error Mapper
 * Maps field errors from validation results
 */

import type { FieldError, FormFieldErrors, ErrorMap } from '../types/ErrorTypes';

export class FieldErrorMapper {
  /**
   * Convert field errors array to record
   */
  static toRecord(errors: FieldError[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const error of errors) {
      result[error.field] = error.message;
    }
    return result;
  }

  /**
   * Convert field errors array to form field errors (with null support)
   */
  static toFormFieldErrors(errors: FieldError[], fields: string[]): FormFieldErrors {
    const result: FormFieldErrors = {};
    for (const field of fields) {
      const fieldError = errors.find((e) => e.field === field);
      result[field] = fieldError?.message ?? null;
    }
    return result;
  }

  /**
   * Extract single field error
   */
  static extractFieldError(errors: FieldError[], field: string): string | null {
    const fieldError = errors.find((e) => e.field === field);
    return fieldError?.message ?? null;
  }

  /**
   * Check if validation has errors for specific fields
   */
  static hasFieldErrors(errors: FieldError[], fields: string[]): boolean {
    return errors.some((error) => fields.includes(error.field));
  }

  /**
   * Get first error message
   */
  static getFirstErrorMessage(errors: FieldError[]): string | null {
    if (errors.length === 0) {
      return null;
    }
    return errors[0].message ?? null;
  }

  /**
   * Map error keys to messages using translation map
   */
  static mapErrorsToMessages(
    errors: FieldError[],
    translations: ErrorMap
  ): FieldError[] {
    return errors.map((error) => ({
      ...error,
      message: translations[error.message] || error.message,
    }));
  }

  /**
   * Create field error
   */
  static createFieldError(field: string, message: string): FieldError {
    return { field, message };
  }

  /**
   * Merge field errors
   */
  static mergeFieldErrors(...errorArrays: FieldError[][]): FieldError[] {
    return errorArrays.flat();
  }

  /**
   * Filter errors by fields
   */
  static filterByFields(errors: FieldError[], fields: string[]): FieldError[] {
    return errors.filter((error) => fields.includes(error.field));
  }

  /**
   * Exclude errors by fields
   */
  static excludeFields(errors: FieldError[], fields: string[]): FieldError[] {
    return errors.filter((error) => !fields.includes(error.field));
  }
}
