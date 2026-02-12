/**
 * React Native Auth - Public API
 * Single source of truth for all Auth operations.
 *
 * @module Auth
 */

// =============================================================================
// DOMAIN LAYER
// =============================================================================

export type { AuthUser, AuthProviderType } from './domain/entities/AuthUser';
export type { UserProfile, UpdateProfileParams } from './domain/entities/UserProfile';
export { AuthError, AuthInitializationError, AuthConfigurationError, AuthValidationError, AuthNetworkError, AuthUserNotFoundError, AuthWrongPasswordError, AuthEmailAlreadyInUseError, AuthWeakPasswordError, AuthInvalidEmailError } from './domain/errors/AuthError';
export type { AuthConfig, PasswordConfig, SocialAuthConfig, SocialProviderConfig, GoogleAuthConfig, AppleAuthConfig, SocialAuthProvider } from './domain/value-objects/AuthConfig';
export { DEFAULT_AUTH_CONFIG, DEFAULT_PASSWORD_CONFIG, DEFAULT_SOCIAL_CONFIG } from './domain/value-objects/AuthConfig';

// =============================================================================
// APPLICATION LAYER
// =============================================================================

export type { IAuthProvider, AuthCredentials, SignUpCredentials, SocialSignInResult } from './application/ports/IAuthProvider';

// =============================================================================
// INFRASTRUCTURE LAYER
// =============================================================================

export { FirebaseAuthProvider } from './infrastructure/providers/FirebaseAuthProvider';
export { AuthService, initializeAuthService, getAuthService, resetAuthService } from './infrastructure/services/AuthService';
export type { IStorageProvider } from './infrastructure/types/Storage.types';
export { createStorageProvider, StorageProviderAdapter } from './infrastructure/adapters/StorageProviderAdapter';
export { initializeAuth, isAuthInitialized, resetAuthInitialization } from './infrastructure/services/initializeAuth';
export type { InitializeAuthOptions } from './infrastructure/services/initializeAuth';
export { validateEmail, validatePasswordForLogin, validatePasswordForRegister, validatePasswordConfirmation, validateDisplayName } from './infrastructure/utils/AuthValidation';
export type { ValidationResult, PasswordStrengthResult, PasswordRequirements } from './infrastructure/utils/AuthValidation';
export { SECURITY_LIMITS, sanitizeWhitespace, sanitizeEmail, sanitizePassword, sanitizeName, sanitizeText, containsDangerousChars, isWithinLengthLimit } from './infrastructure/utils/validation/sanitization';
export type { SecurityLimitKey } from './infrastructure/utils/validation/sanitization';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useAuth } from './presentation/hooks/useAuth';
export type { UseAuthResult } from './presentation/hooks/useAuth';
export { useLoginForm } from './presentation/hooks/useLoginForm';
export type { UseLoginFormConfig, UseLoginFormResult } from './presentation/hooks/useLoginForm';
export { useRegisterForm } from './presentation/hooks/useRegisterForm';
export type { UseRegisterFormConfig, UseRegisterFormResult } from './presentation/hooks/useRegisterForm';
export { useAuthRequired } from './presentation/hooks/useAuthRequired';
export { useRequireAuth, useUserId } from './presentation/hooks/useRequireAuth';
export { useUserProfile } from './presentation/hooks/useUserProfile';
export type { UserProfileData, UseUserProfileParams } from './presentation/hooks/useUserProfile';
export { useAccountManagement } from './presentation/hooks/useAccountManagement';
export type { UseAccountManagementReturn, UseAccountManagementOptions } from './presentation/hooks/useAccountManagement';
export { useProfileUpdate } from './presentation/hooks/useProfileUpdate';
export type { UseProfileUpdateReturn } from './presentation/hooks/useProfileUpdate';
export { useProfileEdit } from './presentation/hooks/useProfileEdit';
export type { ProfileEditFormState, UseProfileEditReturn } from './presentation/hooks/useProfileEdit';
export { useSocialLogin } from './presentation/hooks/useSocialLogin';
export type { UseSocialLoginConfig, UseSocialLoginResult } from './presentation/hooks/useSocialLogin';
export { useGoogleAuth } from './presentation/hooks/useGoogleAuth';
export type { UseGoogleAuthResult } from './presentation/hooks/useGoogleAuth';
export { useAppleAuth } from './presentation/hooks/useAppleAuth';
export type { UseAppleAuthResult } from './presentation/hooks/useAppleAuth';
export { useAuthBottomSheet } from './presentation/hooks/useAuthBottomSheet';
export type { SocialAuthConfiguration } from './presentation/hooks/useAuthBottomSheet';

// =============================================================================
// PRESENTATION LAYER - Components
// =============================================================================

export { AuthProvider } from './presentation/providers/AuthProvider';
export type { ErrorFallbackProps } from './presentation/providers/AuthProvider';
export { LoginScreen } from './presentation/screens/LoginScreen';
export type { LoginScreenProps } from './presentation/screens/LoginScreen';
export { RegisterScreen } from './presentation/screens/RegisterScreen';
export type { RegisterScreenProps } from './presentation/screens/RegisterScreen';
export { AccountScreen } from './presentation/screens/AccountScreen';
export type { AccountScreenProps, AccountScreenConfig } from './presentation/screens/AccountScreen';
export { EditProfileScreen } from './presentation/screens/EditProfileScreen';
export type { EditProfileScreenProps } from './presentation/screens/EditProfileScreen';
export { AuthNavigator } from './presentation/navigation/AuthNavigator';
export type { AuthStackParamList } from './presentation/navigation/AuthNavigator';
export { AuthBottomSheet } from './presentation/components/AuthBottomSheet';
export { ProfileSection } from './presentation/components/ProfileSection';
export type { ProfileSectionProps, ProfileSectionConfig } from './presentation/components/ProfileSection';

// =============================================================================
// STORES
// =============================================================================

export { useAuthStore } from './presentation/stores/authStore';
export { useAuthModalStore } from './presentation/stores/authModalStore';
export { initializeAuthListener, resetAuthListener, isAuthListenerInitialized } from './presentation/stores/initializeAuthListener';
export type { AuthState, AuthActions, UserType, AuthListenerOptions } from './types/auth-store.types';
export * from './presentation/stores/auth.selectors';

// =============================================================================
// UTILITIES & INIT
// =============================================================================

export { getAuthErrorLocalizationKey, resolveErrorMessage } from './presentation/utils/getAuthErrorMessage';
export { createAuthInitModule } from './init';
export type { AuthInitModuleConfig } from './init/createAuthInitModule';

