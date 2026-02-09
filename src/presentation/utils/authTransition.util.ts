/**
 * Auth Transition Detection Utilities
 * Detects and handles authentication state transitions
 */

import { useRef, useEffect } from "react";

export interface AuthTransitionState {
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isVisible: boolean;
}

export interface AuthTransitionResult {
  justAuthenticated: boolean;
  justConvertedFromAnonymous: boolean;
  shouldClose: boolean;
}

/**
 * Track auth state transitions
 */
export function useAuthTransitions(
  state: AuthTransitionState,
  onTransition?: (result: AuthTransitionResult) => void
): void {
  const prevIsAuthenticatedRef = useRef(state.isAuthenticated);
  const prevIsAnonymousRef = useRef(state.isAnonymous);
  const prevIsVisibleRef = useRef(state.isVisible);

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

    onTransition?.(result);

    prevIsAuthenticatedRef.current = state.isAuthenticated;
    prevIsVisibleRef.current = state.isVisible;
    prevIsAnonymousRef.current = state.isAnonymous;
  }, [state.isAuthenticated, state.isVisible, state.isAnonymous, onTransition]);
}

/**
 * Check if should close modal after auth transition
 */
export function shouldCloseAfterAuth(
  justAuthenticated: boolean,
  justConvertedFromAnonymous: boolean,
  isVisible: boolean,
  isAnonymous: boolean
): boolean {
  return (justAuthenticated || justConvertedFromAnonymous) && isVisible && !isAnonymous;
}

/**
 * Execute callback with delay after auth
 */
export function executeAfterAuth(
  callback: () => void,
  delay: number = 100
): NodeJS.Timeout {
  return setTimeout(callback, delay);
}
