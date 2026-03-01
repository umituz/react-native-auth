/**
 * Shared Form Field Hook
 * Provides reusable form field state management with automatic error clearing
 */

import { useCallback, useRef, useState } from "react";

interface UseFormFieldOptions {
  clearLocalError?: () => void;
  fieldsToClear?: string[];
}

/**
 * Hook for managing multiple form fields
 * @param initialFields - Initial field values
 * @param options - Additional options
 * @returns Field states and handlers
 */
export function useFormFields<T extends Record<string, string>>(
  initialFields: T,
  options?: UseFormFieldOptions
) {
  type FieldKey = keyof T;

  const [fields, setFields] = useState<T>(initialFields);

  // Capture the initial fields only once so resetFields has a stable dep
  const initialFieldsRef = useRef(initialFields);

  // Use the function ref directly to avoid re-creating updateField when options object reference changes
  const clearLocalErrorRef = useRef(options?.clearLocalError);
  clearLocalErrorRef.current = options?.clearLocalError;

  const updateField = useCallback(
    (field: FieldKey, value: string) => {
      setFields((prev) => ({ ...prev, [field]: value }));
      // Note: setFieldErrors is handled externally by form hooks
      clearLocalErrorRef.current?.();
    },
    [] // No deps - uses refs internally
  );

  const resetFields = useCallback(() => {
    setFields(initialFieldsRef.current);
  }, []); // No deps - always resets to original initial values

  return {
    fields,
    updateField,
    resetFields,
  };
}
