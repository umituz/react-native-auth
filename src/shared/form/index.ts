/**
 * Form Module Public API
 * Centralized form state management system
 */

// Types
export type {
  FieldState,
  FormState,
  FieldChangeHandler,
  FormFieldConfig,
  FormConfig,
} from './types';

// Builders
export { useField, useForm } from './builders';
export type { UseFieldOptions, UseFieldResult, UseFormOptions, UseFormResult } from './builders';

// State utilities
export {
  isFormValid,
  isFormDirty,
  isFormTouched,
  getFormErrors,
  getFirstFormError,
  countFormErrors,
  getFieldError,
  fieldHasError,
  isFieldTouched,
  resetFormState,
} from './state';

// Utils
export {
  sanitizeFormValues,
  extractFields,
  areRequiredFieldsFilled,
  getEmptyRequiredFields,
  createFieldOptions,
  mergeFormErrors,
  clearFieldErrors,
  createFieldChangeHandler,
  createFieldBlurHandler,
  debounceFieldChange,
  isFieldValueEmpty,
  sanitizeFieldValue,
  formatFieldValue,
  validateFieldValue,
  getFieldDisplayValue,
  truncateFieldValue,
} from './utils';
