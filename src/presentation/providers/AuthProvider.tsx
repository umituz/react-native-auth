/**
 * AuthProvider
 * Wraps app and handles auth initialization
 *
 * Usage:
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */

import React, { useEffect, type ReactNode } from "react";
import { initializeAuthListener } from "../stores/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Initializes Firebase auth listener on mount
 * Must wrap the app root
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return unsubscribe;
  }, []);

  return <>{children}</>;
}
