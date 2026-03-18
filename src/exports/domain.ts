/**
 * Domain Layer Exports
 */

export type { AuthUser, AuthProviderType } from '../domain/entities/AuthUser';
export type { UserProfile, UpdateProfileParams } from '../domain/entities/UserProfile';
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
} from '../domain/errors/AuthError';
export type {
  AuthConfig,
  PasswordConfig,
  SocialAuthConfig,
  SocialProviderConfig,
  GoogleAuthConfig,
  AppleAuthConfig,
  SocialAuthProvider,
} from '../domain/value-objects/AuthConfig';
export {
  DEFAULT_AUTH_CONFIG,
  DEFAULT_PASSWORD_CONFIG,
  DEFAULT_SOCIAL_CONFIG,
} from '../domain/value-objects/AuthConfig';
