/**
 * Form State Utilities
 * Utilities for managing form state
 */

import type { FormState } from '../types/FormTypes';

/**
 * Check if form is valid (no errors)
 */
export function isFormValid<T extends Record<string, string>>(
  formState: FormState<T>
): boolean {
  return Object.values(formState.errors).every((error) => error === null);
}

/**
 * Check if form is dirty (has changes)
 */
export function isFormDirty<T extends Record<string, string>>(
  formState: FormState<T>,
  initialValues: T
): boolean {
  return Object.keys(formState.fields).some((key) => {
    const fieldKey = key as keyof T;
    return formState.fields[fieldKey] !== initialValues[fieldKey];
  });
}

/**
 * Check if form is touched (any field touched)
 */
export function isFormTouched<T extends Record<string, string>>(
  formState: FormState<T>
): boolean {
  return Object.values(formState.touched).some((touched) => touched);
}

/**
 * Get all errors as array
 */
export function getFormErrors<T extends Record<string, string>>(
  formState: FormState<T>
): string[] {
  return Object.values(formState.errors).filter((error): error is string => error !== null);
}

/**
 * Get first error message
 */
export function getFirstFormError<T extends Record<string, string>>(
  formState: FormState<T>
): string | null {
  const errors = getFormErrors(formState);
  return errors.length > 0 ? errors[0] : null;
}

/**
 * Count errors
 */
export function countFormErrors<T extends Record<string, string>>(
  formState: FormState<T>
): number {
  return getFormErrors(formState).length;
}

/**
 * Get error for specific field
 */
export function getFieldError<T extends Record<string, string>>(
  formState: FormState<T>,
  field: keyof T
): string | null {
  return formState.errors[field] || null;
}

/**
 * Check if field has error
 */
export function fieldHasError<T extends Record<string, string>>(
  formState: FormState<T>,
  field: keyof T
): boolean {
  return formState.errors[field] !== null;
}

/**
 * Check if field is touched
 */
export function isFieldTouched<T extends Record<string, string>>(
  formState: FormState<T>,
  field: keyof T
): boolean {
  return formState.touched[field] || false;
}

/**
 * Reset form to initial state
 */
export function resetFormState<T extends Record<string, string>>(
  initialValues: T
): FormState<T> {
  return {
    fields: initialValues,
    errors: Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = null;
      return acc;
    }, {} as Record<keyof T, string | null>),
    touched: Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>),
  };
}
