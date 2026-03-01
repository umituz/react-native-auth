/**
 * Auth Transition Detection Utilities
 * Detects and handles authentication state transitions
 */

import { useRef, useEffect } from "react";

interface AuthTransitionState {
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isVisible: boolean;
}

interface AuthTransitionResult {
  justAuthenticated: boolean;
  justConvertedFromAnonymous: boolean;
  shouldClose: boolean;
}

/**
 * Track auth state transitions
 */
export function useAuthTransitions(
  state: AuthTransitionState,
  onTransition?: (result: AuthTransitionResult) => (() => void) | void
): void {
  const prevIsAuthenticatedRef = useRef(state.isAuthenticated);
  const prevIsAnonymousRef = useRef(state.isAnonymous);
  const prevIsVisibleRef = useRef(state.isVisible);
  const cleanupRef = useRef<(() => void) | null>(null);
  const onTransitionRef = useRef(onTransition);

  // Keep ref in sync without adding to effect deps
  onTransitionRef.current = onTransition;

  useEffect(() => {
    const justAuthenticated = !prevIsAuthenticatedRef.current && state.isAuthenticated;
    const justConvertedFromAnonymous =
      prevIsAnonymousRef.current && !state.isAnonymous && state.isAuthenticated;
    const shouldClose =
      (justAuthenticated || justConvertedFromAnonymous) && state.isVisible && !state.isAnonymous;

    const result: AuthTransitionResult = {
      justAuthenticated,
      justConvertedFromAnonymous,
      shouldClose,
    };

    // Call previous cleanup before running new transition
    cleanupRef.current?.();

    const cleanup = onTransitionRef.current?.(result);
    cleanupRef.current = (typeof cleanup === 'function' ? cleanup : null);

    prevIsAuthenticatedRef.current = state.isAuthenticated;
    prevIsVisibleRef.current = state.isVisible;
    prevIsAnonymousRef.current = state.isAnonymous;

    // Return cleanup function for useEffect
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [state.isAuthenticated, state.isVisible, state.isAnonymous]);
}

/**
 * Execute callback with delay after auth
 */
export function executeAfterAuth(
  callback: () => void,
  delay: number = 100
): ReturnType<typeof setTimeout> {
  return setTimeout(callback, delay);
}
