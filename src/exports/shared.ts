/**
 * Shared Layer Exports
 * New modular utilities
 */

// Validation
export {
  EmailValidator,
  PasswordValidator,
  NameValidator,
} from '../shared/validation/validators';
export type { PasswordConfig } from '../shared/validation/validators';
export {
  EmailSanitizer,
  PasswordSanitizer,
} from '../shared/validation/sanitizers';
export {
  BaseValidationRule,
  RequiredRule,
  RegexRule,
  MinLengthRule,
} from '../shared/validation/rules';
export type {
  ValidationResult,
  PasswordRequirements,
  PasswordStrengthResult,
  ValidationRule,
  ValidatorConfig,
} from '../shared/validation/types';

// Error Handling
export {
  ErrorMapper,
  DEFAULT_AUTH_ERROR_MAPPINGS,
  FieldErrorMapper,
} from '../shared/error-handling/mappers';
export { ErrorHandler, FormErrorHandler } from '../shared/error-handling/handlers';
export type {
  FieldError,
  FormFieldErrors,
  ErrorMap,
  ErrorMappingConfig,
  FormErrorHandlerConfig,
} from '../shared/error-handling/types';

// Form
export { useField, useForm } from '../shared/form/builders';
export type {
  UseFieldOptions,
  UseFieldResult,
  UseFormOptions,
  UseFormResult,
} from '../shared/form/builders';
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
} from '../shared/form/state';
export {
  sanitizeFormValues,
  extractFields,
  areRequiredFieldsFilled,
  getEmptyRequiredFields,
  createFieldOptions,
  mergeFormErrors,
  clearFieldErrors,
} from '../shared/form/utils/formUtils';
export {
  createFieldChangeHandler,
  createFieldBlurHandler,
  debounceFieldChange,
  isFieldValueEmpty,
  sanitizeFieldValue,
  formatFieldValue,
  validateFieldValue,
  getFieldDisplayValue,
  truncateFieldValue,
} from '../shared/form/utils/fieldUtils';
export type {
  FieldState,
  FormState,
  FieldChangeHandler,
  FormFieldConfig,
  FormConfig,
} from '../shared/form/types';
