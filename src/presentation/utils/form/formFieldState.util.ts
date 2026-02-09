/**
 * Form Field State Management Utilities
 * Shared utilities for form field state management across all auth forms
 */

import { useCallback, useState } from "react";

export type FieldState = Record<string, string>;

export interface UseFieldStateResult<T extends FieldState> {
  fields: T;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  setFields: (fields: T | ((prev: T) => T)) => void;
  resetFields: (initial: T) => void;
}

/**
 * Hook for managing form field state with automatic error clearing
 * @param initialFields - Initial field values
 * @param clearErrors - Function to clear errors when fields change
 * @returns Field state and handlers
 */
export function useFieldState<T extends FieldState>(
  initialFields: T,
  clearErrors?: (fields?: (keyof T)[]) => void
): UseFieldStateResult<T> {
  const [fields, setFields] = useState<T>(initialFields);

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFields((prev) => ({ ...prev, [field]: value }));
      clearErrors?.([field as string]);
    },
    [clearErrors]
  );

  const resetFields = useCallback((initial: T) => {
    setFields(initial);
  }, []);

  return {
    fields,
    updateField,
    setFields,
    resetFields,
  };
}

/**
 * Create a field change handler that updates field value and clears errors
 * @param setter - State setter for the field
 * @param clearErrors - Function to clear errors
 * @param fieldsToClear - Fields to clear when this field changes
 * @returns Field change handler
 */
export function createFieldChangeHandler(
  setter: (value: string) => void,
  clearErrors?: () => void
): (value: string) => void {
  return (value: string) => {
    setter(value);
    clearErrors?.();
  };
}

/**
 * Create multiple field change handlers
 * @param setters - Object mapping field names to their setters
 * @param clearErrors - Function to clear errors
 * @returns Object mapping field names to change handlers
 */
export function createFieldChangeHandlers<T extends Record<string, (value: string) => void>>(
  setters: T,
  clearErrors?: () => void
): T {
  return Object.fromEntries(
    Object.entries(setters).map(([key, setter]) => [
      key,
      createFieldChangeHandler(setter, clearErrors),
    ])
  ) as T;
}
