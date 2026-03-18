/**
 * Error Handling Module Public API
 * Centralized error handling system
 */

// Types
export type {
  FieldError,
  FormFieldErrors,
  ErrorMap,
  ErrorMappingConfig,
} from './types';

// Mappers
export { ErrorMapper, DEFAULT_AUTH_ERROR_MAPPINGS, FieldErrorMapper } from './mappers';

// Handlers
export { ErrorHandler, FormErrorHandler } from './handlers';
export type { FormErrorHandlerConfig } from './handlers';
