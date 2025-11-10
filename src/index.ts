/**
 * React Native Auth - Public API
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This is the SINGLE SOURCE OF TRUTH for all Auth operations.
 * ALL imports from the Auth package MUST go through this file.
 *
 * Architecture:
 * - domain: Entities, value objects, errors (business logic)
 * - application: Ports (interfaces)
 * - infrastructure: Auth service implementation
 * - presentation: Hooks (React integration)
 *
 * Usage:
 *   import { initializeAuthService, useAuth } from '@umituz/react-native-auth';
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export {
  AuthError,
  AuthInitializationError,
  AuthConfigurationError,
  AuthValidationError,
  AuthNetworkError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
  AuthEmailAlreadyInUseError,
  AuthWeakPasswordError,
  AuthInvalidEmailError,
} from './domain/errors/AuthError';

export type { AuthConfig } from './domain/value-objects/AuthConfig';
export { DEFAULT_AUTH_CONFIG } from './domain/value-objects/AuthConfig';

// =============================================================================
// APPLICATION LAYER - Ports
// =============================================================================

export type { IAuthService, SignUpParams, SignInParams } from './application/ports/IAuthService';

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

export {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService,
} from './infrastructure/services/AuthService';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useAuth } from './presentation/hooks/useAuth';
export type { UseAuthResult } from './presentation/hooks/useAuth';

