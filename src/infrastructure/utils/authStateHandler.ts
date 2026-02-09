/**
 * Auth State Handler
 * Handles auth state changes with conversion detection
 */

import type { User } from "firebase/auth";
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

    state.current = {
      previousUserId: currentUserId,
      wasAnonymous: isCurrentlyAnonymous,
    };

    await onAuthStateChange?.(user);
  };
}
