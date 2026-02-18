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
 * @param setFieldErrors - Function to set field errors in parent state
 * @param options - Additional options
 * @returns Field states and handlers
 */
export function useFormFields<T extends Record<string, string>>(
  initialFields: T,
  _setFieldErrors: ((errors: Partial<Record<string, string>> | ((prev: Partial<Record<string, string>>) => Partial<Record<string, string>>)) => void) | null,
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
