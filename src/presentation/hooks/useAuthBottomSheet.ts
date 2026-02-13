import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BottomSheetModalRef } from "@umituz/react-native-design-system";
import { useAuthModalStore } from "../stores/authModalStore";
import { useAuth } from "../hooks/useAuth";
import { useGoogleAuth, type GoogleAuthConfig } from "./useGoogleAuth";
import { useAppleAuth } from "./useAppleAuth";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";
import {
  useAuthTransitions,
  executeAfterAuth,
} from "../utils/authTransition.util";
import { determineEnabledProviders } from "../utils/socialAuthHandler.util";

export interface SocialAuthConfiguration {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}

interface UseAuthBottomSheetParams {
  socialConfig?: SocialAuthConfiguration;
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
  /** Called when auth completes successfully (login or register) */
  onAuthSuccess?: () => void;
}

export function useAuthBottomSheet(params: UseAuthBottomSheetParams = {}) {
  const { socialConfig, onGoogleSignIn, onAppleSignIn, onAuthSuccess } = params;

  const modalRef = useRef<BottomSheetModalRef>(null);

  const { isVisible, mode, hideAuthModal, setMode, executePendingCallback, clearPendingCallback } =
    useAuthModalStore();
  const { isAuthenticated, isAnonymous } = useAuth();

  // Social Auth Hooks
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { signInWithGoogle, googleConfigured } = useGoogleAuth(socialConfig?.google);
  const { signInWithApple, appleAvailable } = useAppleAuth();

  // Determine enabled providers
  const providers = useMemo<SocialAuthProvider[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return determineEnabledProviders(socialConfig, appleAvailable, googleConfigured);
  }, [socialConfig, appleAvailable, googleConfigured]);

  // Social auth loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

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

        const timeoutId = executeAfterAuth(() => {
          executePendingCallback();
        });

        return () => clearTimeout(timeoutId);
      }
      return undefined;
    }
  );

  const handleNavigateToRegister = useCallback(() => {
    setMode("register");
  }, [setMode]);

  const handleNavigateToLogin = useCallback(() => {
    setMode("login");
  }, [setMode]);

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    try {
      if (onGoogleSignIn) {
        await onGoogleSignIn();
      } else if (signInWithGoogle) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await signInWithGoogle();
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [onGoogleSignIn, signInWithGoogle]);

  const handleAppleSignIn = useCallback(async () => {
    setAppleLoading(true);
    try {
      if (onAppleSignIn) {
        await onAppleSignIn();
      } else if (signInWithApple) {
        await signInWithApple();
      }
    } finally {
      setAppleLoading(false);
    }
  }, [onAppleSignIn, signInWithApple]);

  return {
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
  };
}
