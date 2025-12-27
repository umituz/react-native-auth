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

import { useEffect, type ReactNode } from "react";
import { initializeAuthListener } from "../stores/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Initializes Firebase auth listener on mount
 * Must wrap the app root
 */
export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return unsubscribe;
  }, []);

  return <>{children}</>;
}
