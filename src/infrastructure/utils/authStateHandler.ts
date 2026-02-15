/**
 * Auth State Handler
 * Handles auth state changes with conversion detection
 */

import type { User } from "firebase/auth";
import { ensureUserDocument } from "@umituz/react-native-firebase";
import { detectConversion, type ConversionState } from "./authConversionDetector";

export interface AuthStateHandlerOptions {
  onUserConverted?: (anonymousId: string, authenticatedId: string) => void | Promise<void>;
  onAuthStateChange?: (user: User | null) => void | Promise<void>;
}

/**
 * Creates auth state change handler with conversion detection
 */
export function createAuthStateHandler(
  state: { current: ConversionState },
  options: AuthStateHandlerOptions
) {
  return async (user: User | null): Promise<void> => {
    const { onUserConverted, onAuthStateChange } = options;

    if (!user) {
      state.current = { previousUserId: null, wasAnonymous: false };
      await onAuthStateChange?.(null);
      return;
    }

    const currentUserId = user.uid;
    const isCurrentlyAnonymous = user.isAnonymous ?? false;

    const conversion = detectConversion(state.current, currentUserId, isCurrentlyAnonymous);

    if (conversion.isConversion && onUserConverted && state.current.previousUserId) {
      try {
        await onUserConverted(state.current.previousUserId, currentUserId);
      } catch {
        // Silently fail - conversion callback errors are handled elsewhere
      }
    }

    const extras = conversion.isConversion && state.current.previousUserId
      ? { previousAnonymousUserId: state.current.previousUserId }
      : undefined;

    try {
      await ensureUserDocument(user, extras);
    } catch (error) {
      console.error('[AuthStateHandler] Failed to ensure user document:', error);
      // Continue execution - don't let user document creation failure block auth flow
    }

    state.current = {
      previousUserId: currentUserId,
      wasAnonymous: isCurrentlyAnonymous,
    };

    // Call user callback with error handling
    if (onAuthStateChange) {
      try {
        await onAuthStateChange(user);
      } catch (error) {
        console.error('[AuthStateHandler] User callback error:', error);
        // Don't propagate user callback errors
      }
    }
  };
}
