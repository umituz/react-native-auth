import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import type { BottomSheetModalRef } from "@umituz/react-native-design-system";
import { useAuthModalStore } from "../stores/authModalStore";
import { useAuth } from "../hooks/useAuth";
import { useGoogleAuth, type GoogleAuthConfig } from "./useGoogleAuth";
import { useAppleAuth } from "./useAppleAuth";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const { isVisible, mode, hideAuthModal, setMode, executePendingCallback, clearPendingCallback } =
    useAuthModalStore();
  const { isAuthenticated, isAnonymous } = useAuth();

  // Social Auth Hooks
  const { signInWithGoogle, googleConfigured } = useGoogleAuth(socialConfig?.google);
  const { signInWithApple, appleAvailable } = useAppleAuth();

  // Determine enabled providers
  const providers = useMemo<SocialAuthProvider[]>(() => {
    const result: SocialAuthProvider[] = [];

    if (Platform.OS === "ios" && socialConfig?.apple?.enabled && appleAvailable) {
      result.push("apple");
    }

    if (googleConfigured) {
      result.push("google");
    }

    return result;
  }, [socialConfig?.apple?.enabled, appleAvailable, googleConfigured]);

  // Handle visibility sync with modalRef
  useEffect(() => {
    if (__DEV__) {
      console.log('[useAuthBottomSheet] Visibility changed:', {
        isVisible,
        hasModalRef: !!modalRef.current,
        modalRefMethods: modalRef.current ? Object.keys(modalRef.current) : [],
      });
    }
    if (isVisible) {
      if (__DEV__) {
        console.log('[useAuthBottomSheet] Calling present()');
      }
      modalRef.current?.present();
    } else {
      if (__DEV__) {
        console.log('[useAuthBottomSheet] Calling dismiss()');
      }
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

  const prevIsAuthenticatedRef = useRef(isAuthenticated);
  const prevIsVisibleRef = useRef(isVisible);
  const prevIsAnonymousRef = useRef(isAnonymous);

  useEffect(() => {
    const justAuthenticated = !prevIsAuthenticatedRef.current && isAuthenticated;
    const justConvertedFromAnonymous = prevIsAnonymousRef.current && !isAnonymous && isAuthenticated;

    if (__DEV__) {
      console.log("[useAuthBottomSheet] Auth state effect:", {
        isAuthenticated,
        isAnonymous,
        isVisible,
        prevIsAuthenticated: prevIsAuthenticatedRef.current,
        prevIsAnonymous: prevIsAnonymousRef.current,
        justAuthenticated,
        justConvertedFromAnonymous,
        willClose: (justAuthenticated || justConvertedFromAnonymous) && isVisible && !isAnonymous,
      });
    }

    if ((justAuthenticated || justConvertedFromAnonymous) && isVisible && !isAnonymous) {
      if (__DEV__) {
        console.log("[useAuthBottomSheet] Auto-closing due to successful authentication transition", {
          justAuthenticated,
          justConvertedFromAnonymous,
        });
      }
      // Close modal and hide first
      modalRef.current?.dismiss();
      hideAuthModal();
      // Notify auth success
      onAuthSuccess?.();
      // Execute callback with delay to ensure auth state has propagated
      setTimeout(() => {
        if (__DEV__) {
          console.log("[useAuthBottomSheet] Executing pending callback after auth");
        }
        executePendingCallback();
      }, 100);
    }

    prevIsAuthenticatedRef.current = isAuthenticated;
    prevIsVisibleRef.current = isVisible;
    prevIsAnonymousRef.current = isAnonymous;
  }, [isAuthenticated, isVisible, isAnonymous, executePendingCallback, hideAuthModal, onAuthSuccess]);

  const handleNavigateToRegister = useCallback(() => {
    setMode("register");
  }, [setMode]);

  const handleNavigateToLogin = useCallback(() => {
    setMode("login");
  }, [setMode]);

  const handleGoogleSignInInternal = useCallback(async () => {
    setGoogleLoading(true);
    try {
      if (onGoogleSignIn) {
        await onGoogleSignIn();
      } else if (signInWithGoogle) {
        await signInWithGoogle();
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [onGoogleSignIn, signInWithGoogle]);

  const handleAppleSignInInternal = useCallback(async () => {
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
    handleGoogleSignIn: handleGoogleSignInInternal,
    handleAppleSignIn: handleAppleSignInInternal,
  };
}
