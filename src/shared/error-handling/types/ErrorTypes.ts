/**
 * Error Types
 * Core types for error handling system
 */

export interface FieldError {
  field: string;
  message: string;
}

export interface FormFieldErrors {
  [fieldName: string]: string | null;
}

export interface ErrorMap {
  [key: string]: string;
}

export interface ErrorMappingConfig {
  errorCodeMap?: ErrorMap;
  errorNameMap?: ErrorMap;
  defaultKey?: string;
}
