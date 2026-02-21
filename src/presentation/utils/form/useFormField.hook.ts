/**
 * Shared Form Field Hook
 * Provides reusable form field state management with automatic error clearing
 */

import { useCallback, useState } from "react";

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
