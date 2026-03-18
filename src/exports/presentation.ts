/**
 * Presentation Layer Exports
 */

// Hooks
export { useAuth } from '../presentation/hooks/useAuth';
export type { UseAuthResult } from '../presentation/hooks/useAuth';
export { useLoginForm } from '../presentation/hooks/useLoginForm';
export type { UseLoginFormConfig, UseLoginFormResult } from '../presentation/hooks/useLoginForm';
export { useRegisterForm } from '../presentation/hooks/useRegisterForm';
export type {
  UseRegisterFormConfig,
  UseRegisterFormResult,
} from '../presentation/hooks/useRegisterForm';
export { useAuthRequired } from '../presentation/hooks/useAuthRequired';
export { useRequireAuth, useUserId } from '../presentation/hooks/useRequireAuth';
export { useUserProfile } from '../presentation/hooks/useUserProfile';
export type {
  UserProfileData,
  UseUserProfileParams,
} from '../presentation/hooks/useUserProfile';
export { useAccountManagement } from '../presentation/hooks/useAccountManagement';
export type {
  UseAccountManagementReturn,
  UseAccountManagementOptions,
} from '../presentation/hooks/useAccountManagement';
export { useAppleAuth } from '../presentation/hooks/useAppleAuth';
export type { UseAppleAuthResult } from '../presentation/hooks/useAppleAuth';
export { useAuthBottomSheet } from '../presentation/hooks/useAuthBottomSheet';
export type {
  SocialAuthConfiguration,
} from '../presentation/hooks/useAuthBottomSheet';
export { useAuthHandlers } from '../presentation/hooks/useAuthHandlers';
export type {
  AuthHandlersAppInfo,
  AuthHandlersTranslations,
} from '../presentation/hooks/useAuthHandlers';
export { usePasswordPromptNavigation } from '../presentation/hooks/usePasswordPromptNavigation';
export type {
  UsePasswordPromptNavigationOptions,
  UsePasswordPromptNavigationReturn,
} from '../presentation/hooks/usePasswordPromptNavigation';
export { useAuthErrorHandler } from '../presentation/hooks/useAuthErrorHandler';
export type {
  UseAuthErrorHandlerConfig,
  UseAuthErrorHandlerResult,
} from '../presentation/hooks/useAuthErrorHandler';
export { useLocalError } from '../presentation/hooks/useLocalError';
export type { UseLocalErrorResult } from '../presentation/hooks/useLocalError';

// Components
export { AuthProvider } from '../presentation/providers/AuthProvider';
export type { ErrorFallbackProps } from '../presentation/providers/AuthProvider';
export { LoginScreen } from '../presentation/screens/LoginScreen';
export type { LoginScreenProps } from '../presentation/screens/LoginScreen';
export { RegisterScreen } from '../presentation/screens/RegisterScreen';
export type { RegisterScreenProps } from '../presentation/screens/RegisterScreen';
export { AccountScreen } from '../presentation/screens/AccountScreen';
export type {
  AccountScreenProps,
  AccountScreenConfig,
} from '../presentation/screens/AccountScreen';
export { EditProfileScreen } from '../presentation/screens/EditProfileScreen';
export type {
  EditProfileScreenProps,
} from '../presentation/screens/EditProfileScreen';
export { PasswordPromptScreen } from '../presentation/screens/PasswordPromptScreen';
export type {
  PasswordPromptScreenProps,
} from '../presentation/screens/PasswordPromptScreen';
export { AuthNavigator } from '../presentation/navigation/AuthNavigator';
export type { AuthStackParamList } from '../presentation/navigation/AuthNavigator';
export { AuthBottomSheet } from '../presentation/components/AuthBottomSheet';
export type {
  AuthBottomSheetProps,
  AuthBottomSheetTranslations,
} from '../presentation/components/AuthBottomSheet';
export { ProfileSection } from '../presentation/components/ProfileSection';
export type {
  ProfileSectionProps,
  ProfileSectionConfig,
} from '../presentation/components/ProfileSection';

// Stores
export { useAuthStore } from '../presentation/stores/authStore';
export { useAuthModalStore } from '../presentation/stores/authModalStore';
export {
  initializeAuthListener,
  resetAuthListener,
  isAuthListenerInitialized,
} from '../presentation/stores/initializeAuthListener';
export type {
  AuthState,
  AuthActions,
  UserType,
  AuthListenerOptions,
} from '../types/auth-store.types';
export type { AuthModalMode } from '../presentation/stores/auth.selectors';
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
} from '../presentation/stores/auth.selectors';
