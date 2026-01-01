/**
 * Simple tracker for auth operations
 */

export const authTracker = {
    logOperationStarted: (operation: string, data?: Record<string, unknown>) => {
        if (__DEV__) {
            console.log(`[Auth] ${operation} started`, data);
        }
    },

    logOperationSuccess: (operation: string, data?: Record<string, unknown>) => {
        if (__DEV__) {
            console.log(`[Auth] ${operation} successful`, data);
        }
    },

    logOperationError: (operation: string, error: unknown, metadata?: Record<string, unknown>) => {
        if (__DEV__) {
            console.error(`[Auth] ${operation} failed`, { error, ...metadata });
        }
    }
};
