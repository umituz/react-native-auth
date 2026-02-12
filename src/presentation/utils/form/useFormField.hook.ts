/**
 * Shared Form Field Hook
 * Provides reusable form field state management with automatic error clearing
 */

import { useCallback, useState } from "react";

export interface UseFormFieldOptions {
  clearLocalError?: () => void;
  fieldsToClear?: string[];
}

export interface UseFormFieldResult {
  value: string;
  error: string | null;
  setValue: (value: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleChange: (text: string) => void;
}

/**
 * Hook for managing a single form field with automatic error clearing
 * @param initialValue - Initial field value
 * @param setError - Function to set field error in parent state
 * @param options - Additional options
 * @returns Field state and handlers
 */
export function useFormField(
  initialValue: string,
  setError: (error: string | null) => void,
  options?: UseFormFieldOptions
): UseFormFieldResult {
  const [value, setValue] = useState(initialValue);
  const [error, setLocalError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setLocalError(null);
    setError(null);
    options?.clearLocalError?.();
  }, [setError, options]);

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      if (error) {
        clearError();
      }
    },
    [error, clearError]
  );

  return {
    value,
    error,
    setValue,
    setError: setLocalError,
    clearError,
    handleChange,
  };
}

/**
 * Hook for managing multiple form fields
 * @param initialFields - Initial field values
 * @param setFieldErrors - Function to set field errors in parent state
 * @param options - Additional options
 * @returns Field states and handlers
 */
export function useFormFields<T extends Record<string, string>>(
  initialFields: T,
  setFieldErrors: ((errors: Partial<Record<string, string>> | ((prev: Partial<Record<string, string>>) => Partial<Record<string, string>>)) => void) | null,
  options?: UseFormFieldOptions
) {
  type FieldKey = keyof T;

  const [fields, setFields] = useState<T>(initialFields);

  const updateField = useCallback(
    (field: FieldKey, value: string) => {
      setFields((prev) => ({ ...prev, [field]: value }));
      // Note: setFieldErrors is handled externally by form hooks
      options?.clearLocalError?.();
    },
    [options]
  );

  const resetFields = useCallback(() => {
    setFields(initialFields);
  }, [initialFields]);

  return {
    fields,
    updateField,
    resetFields,
  };
}
