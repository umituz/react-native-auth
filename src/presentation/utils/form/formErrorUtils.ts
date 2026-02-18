/**
 * Form Error Utilities
 * Shared utilities for form error state management
 */

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

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
