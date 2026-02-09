/**
 * Social Auth Handler Utilities
 * Manages social authentication state and handlers
 */

import { useState, useCallback } from "react";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";
import { Platform } from "react-native";

export interface SocialAuthHandlers {
  googleLoading: boolean;
  appleLoading: boolean;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
}

export interface SocialAuthConfig {
  google?: { iosClientId?: string; webClientId?: string; androidClientId?: string };
  apple?: { enabled: boolean };
}

/**
 * Hook for managing social auth loading states
 */
export function useSocialAuthLoading() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const createGoogleHandler = useCallback(
    (handler: () => Promise<void>) => {
      return async () => {
        setGoogleLoading(true);
        try {
          await handler();
        } finally {
          setGoogleLoading(false);
        }
      };
    },
    []
  );

  const createAppleHandler = useCallback(
    (handler: () => Promise<void>) => {
      return async () => {
        setAppleLoading(true);
        try {
          await handler();
        } finally {
          setAppleLoading(false);
        }
      };
    },
    []
  );

  return {
    googleLoading,
    appleLoading,
    setGoogleLoading,
    setAppleLoading,
    createGoogleHandler,
    createAppleHandler,
  };
}

/**
 * Determine enabled social auth providers
 */
export function determineEnabledProviders(
  config: SocialAuthConfig | undefined,
  appleAvailable: boolean,
  googleConfigured: boolean
): SocialAuthProvider[] {
  const providers: SocialAuthProvider[] = [];

  if (Platform.OS === "ios" && config?.apple?.enabled && appleAvailable) {
    providers.push("apple");
  }

  if (googleConfigured) {
    providers.push("google");
  }

  return providers;
}

/**
 * Create social auth handlers
 */
export function createSocialAuthHandlers(
  googleSignIn: (() => Promise<void>) | undefined,
  appleSignIn: (() => Promise<void>) | undefined,
  internalGoogleHandler: (() => Promise<void>) | undefined,
  internalAppleHandler: (() => Promise<void>) | undefined
): SocialAuthHandlers {
  const googleHandler = googleSignIn || internalGoogleHandler;
  const appleHandler = appleSignIn || internalAppleHandler;

  return {
    googleLoading: false,
    appleLoading: false,
    handleGoogleSignIn: googleHandler || (async () => {}),
    handleAppleSignIn: appleHandler || (async () => {}),
  };
}
