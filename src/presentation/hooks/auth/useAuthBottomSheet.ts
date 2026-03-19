/**
 * Auth Bottom Sheet Hook (Refactored)
 * Main hook for auth bottom sheet management
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { BottomSheetModalRef } from '@umituz/react-native-design-system/molecules';
import { useAuthModalStore } from '../../stores/authModalStore';
import { useAuth } from '../useAuth';
import { useAppleAuth } from '../useAppleAuth';
import { useGoogleAuth } from '../useGoogleAuth';
import { determineEnabledProviders } from '../../utils/socialAuthHandler.util';
import { useAuthTransitions, executeAfterAuth } from '../../utils/authTransition.util';
import { useSocialAuthHandlers } from './useSocialAuthHandlers';
import type { SocialAuthProvider } from '../../../domain/value-objects/AuthConfig';
import type { UseAuthBottomSheetParams } from './types';

export function useAuthBottomSheet(params: UseAuthBottomSheetParams = {}) {
  const { socialConfig, onGoogleSignIn, onAppleSignIn, onAuthSuccess } = params;

  const modalRef = useRef<BottomSheetModalRef>(null);

  const { isVisible, mode, hideAuthModal, setMode, executePendingCallback, clearPendingCallback } =
    useAuthModalStore();
  const { isAuthenticated, isAnonymous } = useAuth();

  // Social auth availability
  const { appleAvailable } = useAppleAuth();
  const { googleConfigured } = useGoogleAuth();

  // Social auth handlers
  const { handleGoogleSignIn, handleAppleSignIn, googleLoading, appleLoading } =
    useSocialAuthHandlers(socialConfig, onGoogleSignIn, onAppleSignIn);

  // Determine enabled providers
  const providers = useMemo<SocialAuthProvider[]>(() => {
    return determineEnabledProviders(socialConfig, appleAvailable, googleConfigured);
  }, [socialConfig, appleAvailable, googleConfigured]);

  // Handle visibility sync with modalRef
  useEffect(() => {
    if (isVisible) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleDismiss = useCallback(() => {
    hideAuthModal();
    clearPendingCallback();
  }, [hideAuthModal, clearPendingCallback]);

  const handleClose = useCallback(() => {
    modalRef.current?.dismiss();
    handleDismiss();
  }, [handleDismiss]);

  // Handle auth transitions
  useAuthTransitions(
    { isAuthenticated, isAnonymous, isVisible },
    (result) => {
      if (result.shouldClose) {
        modalRef.current?.dismiss();
        hideAuthModal();
        onAuthSuccess?.();

        return executeAfterAuth(() => {
          executePendingCallback();
        });
      }
      return undefined;
    }
  );

  const handleNavigateToRegister = useCallback(() => {
    setMode('register');
  }, [setMode]);

  const handleNavigateToLogin = useCallback(() => {
    setMode('login');
  }, [setMode]);

  return useMemo(
    () => ({
      modalRef,
      googleLoading,
      appleLoading,
      mode,
      providers,
      handleDismiss,
      handleClose,
      handleNavigateToRegister,
      handleNavigateToLogin,
      handleGoogleSignIn,
      handleAppleSignIn,
    }),
    [
      modalRef,
      googleLoading,
      appleLoading,
      mode,
      providers,
      handleDismiss,
      handleClose,
      handleNavigateToRegister,
      handleNavigateToLogin,
      handleGoogleSignIn,
      handleAppleSignIn,
    ]
  );
}
