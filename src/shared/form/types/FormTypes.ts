/**
 * Form Types
 * Core types for form system
 */

export interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
}

export interface FormState<T extends Record<string, string>> {
  fields: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
}

export interface FieldChangeHandler {
  (value: string): void;
}

export interface FormFieldConfig {
  validateOnChange?: boolean;
  clearErrorOnChange?: boolean;
}

export interface FormConfig {
  validateOnBlur?: boolean;
  clearErrorsOnSubmit?: boolean;
}
