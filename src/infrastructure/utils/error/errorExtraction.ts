/**
 * Error Extraction Utilities
 * Utilities for extracting error information from various error types
 */

/**
 * Firebase Auth error structure
 * Based on Firebase Auth SDK error format
 */
interface FirebaseAuthError {
    code: string;
    message: string;
    name?: string;
    stack?: string;
}

/**
 * Type guard to check if error is a valid Firebase Auth error
 * @param error - Unknown error to check
 * @returns True if error matches Firebase Auth error structure
 */
export function isFirebaseAuthError(error: unknown): error is FirebaseAuthError {
    if (!error || typeof error !== 'object') {
        return false;
    }

    const err = error as Partial<FirebaseAuthError>;
    return (
        typeof err.code === 'string' &&
        typeof err.message === 'string' &&
        err.code.startsWith('auth/')
    );
}

/**
 * Extract error code from error object
 * @param error - Unknown error
 * @returns Error code or empty string
 */
export function extractErrorCode(error: unknown): string {
    if (isFirebaseAuthError(error)) {
        return error.code;
    }

    // Fallback for non-Firebase errors
    if (error && typeof error === 'object' && 'code' in error) {
        const code = (error as { code?: unknown }).code;
        if (typeof code === 'string') {
            return code;
        }
    }

    return '';
}

/**
 * Extract error message from error object
 * @param error - Unknown error
 * @returns Error message or default message
 */
export function extractErrorMessage(error: unknown): string {
    if (isFirebaseAuthError(error)) {
        return error.message;
    }

    // Fallback for Error objects
    if (error instanceof Error) {
        return error.message;
    }

    // Fallback for objects with message property
    if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === 'string') {
            return message;
        }
    }

    return "Authentication failed";
}
