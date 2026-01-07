import { useCallback, useEffect, useRef, useState } from "react";
import type { BottomSheetModalRef } from "@umituz/react-native-design-system";
import { useAuthModalStore } from "../stores/authModalStore";
import { useAuth } from "../hooks/useAuth";

interface UseAuthBottomSheetProps {
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
}

export function useAuthBottomSheet({ onGoogleSignIn, onAppleSignIn }: UseAuthBottomSheetProps) {
  const modalRef = useRef<BottomSheetModalRef>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const { isVisible, mode, hideAuthModal, setMode, executePendingCallback, clearPendingCallback } =
    useAuthModalStore();
  const { isAuthenticated, isAnonymous } = useAuth();

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

  const prevIsAuthenticatedRef = useRef(isAuthenticated);
  const prevIsVisibleRef = useRef(isVisible);
  const prevIsAnonymousRef = useRef(isAnonymous);

  useEffect(() => {
    // Determine if user just successfully authenticated (either A: were not authed at all, or B: were anonymous and now aren't)
    const justAuthenticated = !prevIsAuthenticatedRef.current && isAuthenticated;
    const justConvertedFromAnonymous = prevIsAnonymousRef.current && !isAnonymous && isAuthenticated;

    if ((justAuthenticated || justConvertedFromAnonymous) && isVisible && !isAnonymous) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[AuthBottomSheet] Auto-closing due to successful authentication transition", {
          justAuthenticated,
          justConvertedFromAnonymous,
        });
      }
      handleClose();
      executePendingCallback();
    }
    
    // Update refs for next render
    prevIsAuthenticatedRef.current = isAuthenticated;
    prevIsVisibleRef.current = isVisible;
    prevIsAnonymousRef.current = isAnonymous;
  }, [isAuthenticated, isVisible, isAnonymous, executePendingCallback, handleClose]);

  const handleNavigateToRegister = useCallback(() => {
    setMode("register");
  }, [setMode]);

  const handleNavigateToLogin = useCallback(() => {
    setMode("login");
  }, [setMode]);

  const handleGoogleSignIn = useCallback(async () => {
    if (!onGoogleSignIn) return;
    setGoogleLoading(true);
    try {
      await onGoogleSignIn();
    } finally {
      setGoogleLoading(false);
    }
  }, [onGoogleSignIn]);

  const handleAppleSignIn = useCallback(async () => {
    if (!onAppleSignIn) return;
    setAppleLoading(true);
    try {
      await onAppleSignIn();
    } finally {
      setAppleLoading(false);
    }
  }, [onAppleSignIn]);

  return {
    modalRef,
    googleLoading,
    appleLoading,
    mode,
    handleDismiss,
    handleClose,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  };
}
