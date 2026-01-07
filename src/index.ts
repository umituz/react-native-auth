/**
 * React Native Auth - Public API
 * Single source of truth for all Auth operations.
 */

// DOMAIN LAYER
export type { AuthUser, AuthProviderType } from './domain/entities/AuthUser';
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

export type {
  AuthConfig,
  PasswordConfig,
  SocialAuthConfig,
  SocialProviderConfig,
  GoogleAuthConfig,
  AppleAuthConfig,
  SocialAuthProvider,
} from './domain/value-objects/AuthConfig';
export {
  DEFAULT_AUTH_CONFIG,
  DEFAULT_PASSWORD_CONFIG,
  DEFAULT_SOCIAL_CONFIG,
} from './domain/value-objects/AuthConfig';

// APPLICATION LAYER
export type { IAuthService, SignUpParams, SignInParams } from './application/ports/IAuthService';
export type {
  IAuthProvider,
  AuthCredentials,
  SignUpCredentials,
  SocialSignInResult,
} from './application/ports/IAuthProvider';

// INFRASTRUCTURE LAYER
export { FirebaseAuthProvider } from './infrastructure/providers/FirebaseAuthProvider';
export {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService,
} from './infrastructure/services/AuthService';
export {
  createStorageProvider,
  StorageProviderAdapter,
} from './infrastructure/adapters/StorageProviderAdapter';
export type { IStorageProvider } from './infrastructure/types/Storage.types';
export {
  ensureUserDocument,
  markUserDeleted,
  configureUserDocumentService,
} from './infrastructure/services/UserDocumentService';
export {
  initializeAuth,
  isAuthInitialized,
  resetAuthInitialization,
} from './infrastructure/services/initializeAuth';
export type { InitializeAuthOptions } from './infrastructure/services/initializeAuth';
export type {
  UserDocumentConfig,
  UserDocumentExtras,
  UserDocumentUser,
} from './infrastructure/services/UserDocumentService';

// VALIDATION
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
  ValidationConfig,
} from './infrastructure/utils/AuthValidation';
export {
  DEFAULT_VAL_CONFIG,
} from './infrastructure/utils/AuthValidation';

// PRESENTATION LAYER
export { AuthProvider } from './presentation/providers/AuthProvider';
export { useAuth } from './presentation/hooks/useAuth';
export type { UseAuthResult } from './presentation/hooks/useAuth';
export { useAuthRequired } from './presentation/hooks/useAuthRequired';
export type { UseAuthRequiredResult } from './presentation/hooks/useAuthRequired';
export { useRequireAuth, useUserId } from './presentation/hooks/useRequireAuth';
export { useUserProfile } from './presentation/hooks/useUserProfile';
export type { UserProfileData, UseUserProfileParams } from './presentation/hooks/useUserProfile';
export { useAccountManagement } from './presentation/hooks/useAccountManagement';
export type { UseAccountManagementReturn } from './presentation/hooks/useAccountManagement';
export { useProfileUpdate } from './presentation/hooks/useProfileUpdate';
export type { UseProfileUpdateReturn } from './presentation/hooks/useProfileUpdate';
export { useProfileEdit } from './presentation/hooks/useProfileEdit';
export type { UseProfileEditReturn, ProfileEditFormState } from './presentation/hooks/useProfileEdit';
export { useSocialLogin } from './presentation/hooks/useSocialLogin';
export type { UseSocialLoginConfig, UseSocialLoginResult } from './presentation/hooks/useSocialLogin';
export { useGoogleAuth } from './presentation/hooks/useGoogleAuth';
export type { UseGoogleAuthResult, GoogleAuthConfig as GoogleAuthHookConfig } from './presentation/hooks/useGoogleAuth';
export { useAppleAuth } from './presentation/hooks/useAppleAuth';
export type { UseAppleAuthResult } from './presentation/hooks/useAppleAuth';
export { useAuthBottomSheet } from './presentation/hooks/useAuthBottomSheet';
export type { SocialAuthConfiguration } from './presentation/hooks/useAuthBottomSheet';

// DOMAIN ENTITIES & UTILS
export type { UserProfile, UpdateProfileParams } from './domain/entities/UserProfile';
export { generateAnonymousName, getAnonymousDisplayName } from './domain/utils/anonymousNameGenerator';
export type { AnonymousNameConfig } from './domain/utils/anonymousNameGenerator';
export { migrateUserData, configureMigration } from './domain/utils/migration';
export type { MigrationConfig } from './domain/utils/migration';

// SCREENS & NAVIGATION
export { LoginScreen } from './presentation/screens/LoginScreen';
export { RegisterScreen } from './presentation/screens/RegisterScreen';
export { AccountScreen } from './presentation/screens/AccountScreen';
export type { AccountScreenConfig, AccountScreenProps } from './presentation/screens/AccountScreen';
export { EditProfileScreen } from './presentation/screens/EditProfileScreen';
export type { EditProfileConfig, EditProfileScreenProps } from './presentation/screens/EditProfileScreen';
export { AuthNavigator } from './presentation/navigation/AuthNavigator';
export type {
  AuthStackParamList,
  AuthNavigatorProps,
} from './presentation/navigation/AuthNavigator';

// COMPONENTS
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
export { SocialLoginButtons } from './presentation/components/SocialLoginButtons';
export type { SocialLoginButtonsProps } from './presentation/components/SocialLoginButtons';
export { ProfileSection } from './presentation/components/ProfileSection';
export type { ProfileSectionConfig, ProfileSectionProps } from './presentation/components/ProfileSection';
export { AccountActions } from './presentation/components/AccountActions';
export type { AccountActionsConfig, AccountActionsProps } from './presentation/components/AccountActions';

// STORES
export { useAuthModalStore } from './presentation/stores/authModalStore';
export type { AuthModalMode } from './presentation/stores/authModalStore';
export {
  useAuthStore,
  initializeAuthListener,
  resetAuthListener,
  isAuthListenerInitialized,
  selectIsAuthenticated,
  selectUserId,
  selectIsAnonymous,
  selectUserType,
  selectIsAuthReady,
  getUserId,
  getUserType,
  getIsAuthenticated,
  getIsAnonymous,
} from './presentation/stores/authStore';
export type { UserType, AuthState, AuthActions } from './presentation/stores/authStore';
export type { AuthListenerOptions } from './types/auth-store.types';

// UTILITIES
export { getAuthErrorLocalizationKey } from './presentation/utils/getAuthErrorMessage';
