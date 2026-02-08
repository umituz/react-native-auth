/**
 * Form Error Utilities
 * Shared utilities for form error state management
 */

import { useCallback } from "react";

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

/**
 * Create a field error updater that clears the specified field error
 * @param fieldErrors - Current field errors state
 * @param setFieldErrors - Function to update field errors
 * @param field - Field to clear
 * @returns Function to clear the specified field error
 */
export function createFieldErrorUpdater<T extends string>(
    fieldErrors: FieldErrors<T>,
    setFieldErrors: (errors: FieldErrors<T> | ((prev: FieldErrors<T>) => FieldErrors<T>)) => void,
    localError: string | null,
    setLocalError: (error: string | null) => void
) {
    return useCallback((field: T) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
        if (localError) {
            setLocalError(null);
        }
    }, [fieldErrors, setFieldErrors, localError, setLocalError]);
}

/**
 * Create a single field error updater
 * @param setFieldErrors - Function to update field errors
 * @param setLocalError - Function to update local error
 * @param fields - Fields to clear when this updater is called
 * @returns Function to clear specified field errors
 */
export function useFieldErrorClearer<T extends string>(
    setFieldErrors: (errors: FieldErrors<T> | ((prev: FieldErrors<T>) => FieldErrors<T>)) => void,
    setLocalError: (error: string | null) => void,
    fields: T[]
) {
    return useCallback(() => {
        setFieldErrors((prev) => {
            const next = { ...prev };
            fields.forEach((field) => {
                if (next[field]) {
                    delete next[field];
                }
            });
            return next;
        });
        setLocalError(null);
    }, [setFieldErrors, setLocalError, fields]);
}

/**
 * Clear a specific field error
 * @param setFieldErrors - Function to update field errors
 * @param field - Field to clear
 */
export function clearFieldError<T extends string>(
    setFieldErrors: (errors: FieldErrors<T> | ((prev: FieldErrors<T>) => FieldErrors<T>)) => void,
    field: T
) {
    setFieldErrors((prev) => {
        const next = { ...prev };
        if (next[field]) {
            delete next[field];
        }
        return next;
    });
}

/**
 * Clear multiple field errors
 * @param setFieldErrors - Function to update field errors
 * @param fields - Fields to clear
 */
export function clearFieldErrors<T extends string>(
    setFieldErrors: (errors: FieldErrors<T> | ((prev: FieldErrors<T>) => FieldErrors<T>)) => void,
    fields: T[]
) {
    setFieldErrors((prev) => {
        const next = { ...prev };
        fields.forEach((field) => {
            if (next[field]) {
                delete next[field];
            }
        });
        return next;
    });
}
