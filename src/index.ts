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

// =============================================================================
// INFRASTRUCTURE LAYER
// =============================================================================
export type { AuthCredentials, SignUpCredentials } from './infrastructure/repositories/AuthRepository';

// Services
export {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService,
} from './infrastructure/services/AuthService';
export {
  initializeAuth,
  isAuthInitialized,
  resetAuthInitialization,
} from './infrastructure/services/initializeAuth';
export type { InitializeAuthOptions } from './infrastructure/services/initializeAuth';

// Storage
export type { IStorageProvider } from './infrastructure/types/Storage.types';
export {
  createStorageProvider,
  StorageProviderAdapter,
} from './infrastructure/adapters/StorageProviderAdapter';

// Validation
export {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
} from './infrastructure/utils/AuthValidation';
export type {
  FormValidationError,
  FormValidationResult,
} from './infrastructure/utils/validation/types';
export {
  SECURITY_LIMITS,
  sanitizeEmail,
  sanitizePassword,
  sanitizeName,
} from './infrastructure/utils/validation/sanitization';
export type { SecurityLimitKey } from './infrastructure/utils/validation/sanitization';
export {
  isEmpty,
  isEmptyEmail,
  isEmptyPassword,
  isEmptyName,
  isNotEmpty,
  hasContent,
} from './infrastructure/utils/validation/validationHelpers';
export { safeCallback, safeCallbackSync } from './infrastructure/utils/safeCallback';

// Calculators
export {
  calculateUserId,
  calculateHasFirebaseUser,
  calculateIsAnonymous,
  calculateIsAuthenticated,
  calculateUserType,
  calculateIsAuthReady,
  calculateDerivedAuthState,
  collectFieldErrors,
  extractFieldError,
  hasFieldErrors,
  getFirstErrorMessage,
  calculateUserProfileDisplay,
  calculatePasswordRequirements,
  calculatePasswordsMatch,
  calculatePasswordValidation,
  calculatePasswordStrength,
} from './infrastructure/utils/calculators';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================
export { useAuth } from './presentation/hooks/useAuth';
export type { UseAuthResult } from './presentation/hooks/useAuth';
export { useLoginForm } from './presentation/hooks/useLoginForm';
export type { UseLoginFormConfig, UseLoginFormResult } from './presentation/hooks/useLoginForm';
export { useRegisterForm } from './presentation/hooks/useRegisterForm';
export type {
  UseRegisterFormConfig,
  UseRegisterFormResult,
} from './presentation/hooks/useRegisterForm';
export { useAuthRequired } from './presentation/hooks/useAuthRequired';
export { useRequireAuth, useUserId } from './presentation/hooks/useRequireAuth';
export { useUserProfile } from './presentation/hooks/useUserProfile';
export type {
  UserProfileData,
  UseUserProfileParams,
} from './presentation/hooks/useUserProfile';
export { useAccountManagement } from './presentation/hooks/useAccountManagement';
export type {
  UseAccountManagementReturn,
  UseAccountManagementOptions,
} from './presentation/hooks/useAccountManagement';
export { useAppleAuth } from './presentation/hooks/useAppleAuth';
export type { UseAppleAuthResult } from './presentation/hooks/useAppleAuth';
export { useAuthBottomSheet } from './presentation/hooks/useAuthBottomSheet';
export type {
  SocialAuthConfiguration,
} from './presentation/hooks/useAuthBottomSheet';
export { useAuthHandlers } from './presentation/hooks/useAuthHandlers';
export type {
  AuthHandlersAppInfo,
  AuthHandlersTranslations,
} from './presentation/hooks/useAuthHandlers';
export { usePasswordPromptNavigation } from './presentation/hooks/usePasswordPromptNavigation';
export type {
  UsePasswordPromptNavigationOptions,
  UsePasswordPromptNavigationReturn,
} from './presentation/hooks/usePasswordPromptNavigation';
export { useAuthErrorHandler } from './presentation/hooks/useAuthErrorHandler';
export type {
  UseAuthErrorHandlerConfig,
  UseAuthErrorHandlerResult,
} from './presentation/hooks/useAuthErrorHandler';
export { useLocalError } from './presentation/hooks/useLocalError';
export type { UseLocalErrorResult } from './presentation/hooks/useLocalError';

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
export type {
  AccountScreenProps,
  AccountScreenConfig,
} from './presentation/screens/AccountScreen';
export { EditProfileScreen } from './presentation/screens/EditProfileScreen';
export type {
  EditProfileScreenProps,
} from './presentation/screens/EditProfileScreen';
export { PasswordPromptScreen } from './presentation/screens/PasswordPromptScreen';
export type {
  PasswordPromptScreenProps,
} from './presentation/screens/PasswordPromptScreen';
export { AuthNavigator } from './presentation/navigation/AuthNavigator';
export type { AuthStackParamList } from './presentation/navigation/AuthNavigator';
export { AuthBottomSheet } from './presentation/components/AuthBottomSheet';
export type {
  AuthBottomSheetProps,
  AuthBottomSheetTranslations,
} from './presentation/components/AuthBottomSheet';
export { ProfileSection } from './presentation/components/ProfileSection';
export type {
  ProfileSectionProps,
  ProfileSectionConfig,
} from './presentation/components/ProfileSection';

// =============================================================================
// PRESENTATION LAYER - Stores
// =============================================================================
export { useAuthStore } from './presentation/stores/authStore';
export { useAuthModalStore } from './presentation/stores/authModalStore';
export {
  initializeAuthListener,
  resetAuthListener,
  isAuthListenerInitialized,
} from './presentation/stores/initializeAuthListener';
export type {
  AuthState,
  AuthActions,
  UserType,
  AuthListenerOptions,
} from './types/auth-store.types';
export type { AuthModalMode } from './presentation/stores/auth.selectors';
export {
  selectUser,
  selectLoading,
  selectError,
  selectSetLoading,
  selectSetError,
  selectSetIsAnonymous,
  selectShowAuthModal,
  selectUserId,
  selectIsAuthenticated,
  selectHasFirebaseUser,
  selectIsAnonymous,
  selectUserType,
  selectIsAuthReady,
  selectFirebaseUserId,
  selectAuthState,
} from './presentation/stores/auth.selectors';

// =============================================================================
// SHARED LAYER (New Modular Utilities)
// =============================================================================
// Validation
export { EmailValidator, PasswordValidator, NameValidator } from './shared/validation/validators';
export {
  EmailSanitizer,
  PasswordSanitizer,
  NameSanitizer,
} from './shared/validation/sanitizers';
export {
  BaseValidationRule,
  RequiredRule,
  RegexRule,
  MinLengthRule,
} from './shared/validation/rules';
export type {
  ValidationResult,
  PasswordRequirements,
  PasswordStrengthResult,
  ValidationRule,
  ValidatorConfig,
} from './shared/validation/types';

// Error Handling
export {
  ErrorMapper,
  DEFAULT_AUTH_ERROR_MAPPINGS,
  FieldErrorMapper,
} from './shared/error-handling/mappers';
export { ErrorHandler, FormErrorHandler } from './shared/error-handling/handlers';
export type {
  FieldError,
  FormFieldErrors,
  ErrorMap,
  ErrorMappingConfig,
  FormErrorHandlerConfig,
} from './shared/error-handling/types';

// Form
export { useField, useForm } from './shared/form/builders';
export type {
  UseFieldOptions,
  UseFieldResult,
  UseFormOptions,
  UseFormResult,
} from './shared/form/builders';
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
} from './shared/form/state';
export {
  sanitizeFormValues,
  extractFields,
  areRequiredFieldsFilled,
  getEmptyRequiredFields,
  createFieldOptions,
  mergeFormErrors,
  clearFieldErrors,
} from './shared/form/utils/formUtils';
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
} from './shared/form/utils/fieldUtils';
export type {
  FieldState,
  FormState,
  FieldChangeHandler,
  FormFieldConfig,
  FormConfig,
} from './shared/form/types';

// =============================================================================
// UTILITIES & INIT
// =============================================================================
export {
  getAuthErrorLocalizationKey,
  resolveErrorMessage,
} from './presentation/utils/getAuthErrorMessage';
export { createAuthInitModule } from './init/createAuthInitModule';
export type { AuthInitModuleConfig } from './init/createAuthInitModule';
