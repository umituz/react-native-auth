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
 * - infrastructure: Auth providers and service implementation
 * - presentation: Hooks (React integration)
 *
 * Usage:
 *   import { initializeAuthService, useAuth } from '@umituz/react-native-auth';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type { AuthUser } from './domain/entities/AuthUser';

// =============================================================================
// DOMAIN LAYER - Errors
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

// =============================================================================
// DOMAIN LAYER - Value Objects
// =============================================================================

export type { AuthConfig, PasswordConfig } from './domain/value-objects/AuthConfig';
export { DEFAULT_AUTH_CONFIG, DEFAULT_PASSWORD_CONFIG } from './domain/value-objects/AuthConfig';

// =============================================================================
// APPLICATION LAYER - Ports
// =============================================================================

export type { IAuthService, SignUpParams, SignInParams } from './application/ports/IAuthService';
export type {
  IAuthProvider,
  AuthCredentials,
  SignUpCredentials,
} from './application/ports/IAuthProvider';

// =============================================================================
// INFRASTRUCTURE LAYER - Providers
// =============================================================================

export { FirebaseAuthProvider } from './infrastructure/providers/FirebaseAuthProvider';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService,
} from './infrastructure/services/AuthService';

// =============================================================================
// INFRASTRUCTURE LAYER - Validation
// =============================================================================

export {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
} from './infrastructure/utils/AuthValidation';

export type {
  ValidationResult,
  PasswordStrengthResult,
  PasswordRequirements,
} from './infrastructure/utils/AuthValidation';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useAuth } from './presentation/hooks/useAuth';
export type { UseAuthResult } from './presentation/hooks/useAuth';

export { useUserProfile } from './presentation/hooks/useUserProfile';
export type { UserProfileData, UseUserProfileParams } from './presentation/hooks/useUserProfile';

// =============================================================================
// PRESENTATION LAYER - Screens & Navigation
// =============================================================================

export { LoginScreen } from './presentation/screens/LoginScreen';
export { RegisterScreen } from './presentation/screens/RegisterScreen';
export { AuthNavigator } from './presentation/navigation/AuthNavigator';
export type {
  AuthStackParamList,
  AuthNavigatorProps,
} from './presentation/navigation/AuthNavigator';

// =============================================================================
// PRESENTATION LAYER - Components
// =============================================================================

export { AuthContainer } from './presentation/components/AuthContainer';
export { AuthHeader } from './presentation/components/AuthHeader';
export { AuthFormCard } from './presentation/components/AuthFormCard';
export { LoginForm } from './presentation/components/LoginForm';
export { RegisterForm } from './presentation/components/RegisterForm';
export { AuthLegalLinks } from './presentation/components/AuthLegalLinks';
export type { AuthLegalLinksProps } from './presentation/components/AuthLegalLinks';
export { PasswordStrengthIndicator } from './presentation/components/PasswordStrengthIndicator';
export type { PasswordStrengthIndicatorProps } from './presentation/components/PasswordStrengthIndicator';
export { PasswordMatchIndicator } from './presentation/components/PasswordMatchIndicator';
export type { PasswordMatchIndicatorProps } from './presentation/components/PasswordMatchIndicator';
export { AuthBottomSheet } from './presentation/components/AuthBottomSheet';
export type { AuthBottomSheetProps } from './presentation/components/AuthBottomSheet';
export { ProfileSection } from './presentation/components/ProfileSection';
export type { ProfileSectionConfig, ProfileSectionProps } from './presentation/components/ProfileSection';

// =============================================================================
// PRESENTATION LAYER - Stores
// =============================================================================

export { useAuthModalStore } from './presentation/stores/authModalStore';
export type { AuthModalMode } from './presentation/stores/authModalStore';

// =============================================================================
// PRESENTATION LAYER - Utilities
// =============================================================================

export { getAuthErrorLocalizationKey } from './presentation/utils/getAuthErrorMessage';

