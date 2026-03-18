/**
 * Social Auth Handlers
 * Handles social authentication logic
 */

import { useCallback, useState } from 'react';
import { useGoogleAuth } from '../useGoogleAuth';
import { useAppleAuth } from '../useAppleAuth';
import type { SocialAuthConfiguration, SocialAuthHandlers } from './types';

export function useSocialAuthHandlers(
  socialConfig?: SocialAuthConfiguration,
  onGoogleSignIn?: () => Promise<void>,
  onAppleSignIn?: () => Promise<void>
): SocialAuthHandlers {
  // Social Auth Hooks
  const { signInWithGoogle, googleConfigured } = useGoogleAuth(socialConfig?.google);
  const { signInWithApple, appleAvailable } = useAppleAuth();

  // Social auth loading states
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
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
    handleGoogleSignIn,
    handleAppleSignIn,
    googleLoading,
    appleLoading,
  };
}
