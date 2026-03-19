/**
 * Form Error Handler
 * Handles form-specific error logic
 */

import type { FieldError, ErrorMap, FormErrorHandlerConfig } from '../types/ErrorTypes';
import { ErrorHandler } from './ErrorHandler';
import { FieldErrorMapper } from '../mappers/FieldErrorMapper';

export class FormErrorHandler extends ErrorHandler {
  constructor(config: FormErrorHandlerConfig = {}) {
    super(config.translations, config.errorMappings);
  }

  /**
   * Handle validation result errors
   */
  handleValidationErrors(
    errors: FieldError[],
    translations?: ErrorMap
  ): Record<string, string> {
    const mappedErrors = translations
      ? FieldErrorMapper.mapErrorsToMessages(errors, translations)
      : errors;

    return FieldErrorMapper.toRecord(mappedErrors);
  }

  /**
   * Get form field errors with null support
   */
  getFormFieldErrors(
    errors: FieldError[],
    fields: string[]
  ): Record<string, string | null> {
    return FieldErrorMapper.toFormFieldErrors(errors, fields);
  }

  /**
   * Check if form has errors
   */
  formHasErrors(errors: FieldError[]): boolean {
    return errors.length > 0;
  }

  /**
   * Check if specific field has error
   */
  fieldHasError(errors: FieldError[], field: string): boolean {
    return FieldErrorMapper.extractFieldError(errors, field) !== null;
  }

  /**
   * Get first form error message
   */
  getFirstFormError(errors: FieldError[]): string | null {
    return FieldErrorMapper.getFirstErrorMessage(errors);
  }

  /**
   * Handle auth error for form
   */
  handleAuthError(error: unknown): string {
    return this.handle(error);
  }

  /**
   * Clear field errors for specific fields
   */
  clearFieldErrors(errors: FieldError[], fields: string[]): FieldError[] {
    return FieldErrorMapper.excludeFields(errors, fields);
  }

  /**
   * Filter errors to only specific fields
   */
  filterToFields(errors: FieldError[], fields: string[]): FieldError[] {
    return FieldErrorMapper.filterByFields(errors, fields);
  }

  /**
   * Create field error
   */
  createFieldError(field: string, message: string): FieldError {
    return FieldErrorMapper.createFieldError(field, message);
  }

  /**
   * Merge multiple error arrays
   */
  mergeErrors(...errorArrays: FieldError[][]): FieldError[] {
    return FieldErrorMapper.mergeFieldErrors(...errorArrays);
  }
}
