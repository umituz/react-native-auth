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
 * Hook for managing a single social auth provider's loading state
 * @returns Loading state and handler creator
 */
export function useSocialAuthLoading() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const createHandler = useCallback(
    (setter: (loading: boolean) => void, signInHandler?: () => Promise<void>) => {
      return async () => {
        if (!signInHandler) {
          throw new Error("Sign-in handler not available");
        }
        setter(true);
        try {
          await signInHandler();
        } finally {
          setter(false);
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
    createHandler,
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
 * Select the appropriate sign-in handler from external and internal options
 * @param externalHandler - External handler provided by parent
 * @param internalHandler - Internal handler from auth hook
 * @returns The selected handler or undefined
 */
export function selectSignInHandler(
  externalHandler?: () => Promise<void>,
  internalHandler?: () => Promise<void>
): (() => Promise<void>) | undefined {
  return externalHandler ?? internalHandler;
}

