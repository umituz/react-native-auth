/**
 * Social Auth Handler Utilities
 * Manages social authentication state and handlers
 */

import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";
import { Platform } from "react-native";

interface SocialAuthConfig {
  google?: { iosClientId?: string; webClientId?: string; androidClientId?: string };
  apple?: { enabled: boolean };
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


