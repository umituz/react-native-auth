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

import { useEffect, useState, type ReactNode } from "react";
import { View, Text } from "react-native";
import { initializeAuthListener } from "../stores/initializeAuthListener";

interface AuthProviderProps {
  children: ReactNode;
  /**
   * Custom error component to display when auth initialization fails
   */
  ErrorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Authentication Error
      </Text>
      <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 20 }}>
        {error.message || "Failed to initialize authentication. Please restart the app."}
      </Text>
      <Text
        style={{ fontSize: 14, color: "#007AFF" }}
        onPress={retry}
      >
        Retry
      </Text>
    </View>
  );
}

/**
 * AuthProvider component
 * Initializes Firebase auth listener on mount
 * Must wrap the app root
 * Includes error boundary for graceful error handling
 */
export function AuthProvider({ children, ErrorFallback = DefaultErrorFallback }: AuthProviderProps): ReactNode {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = initializeAuthListener();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown initialization error");
      setError(errorObj);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch {
          // Silently fail - cleanup errors are handled elsewhere
        }
      }
    };
  }, [retryCount]); // Re-run on retry

  // If error occurred, show error fallback
  if (error) {
    return <ErrorFallback error={error} retry={() => {
      setError(null);
      setRetryCount(prev => prev + 1);
    }} />;
  }

  return <>{children}</>;
}
