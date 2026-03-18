/**
 * Form Builder
 * Builds form state with multiple fields
 */

import { useCallback, useRef } from 'react';
import type { FormState, FormConfig, FieldChangeHandler } from '../types/FormTypes';

export interface UseFormOptions<T extends Record<string, string>> extends FormConfig {
  initialValues: T;
  onFieldChange?: (field: keyof T, value: string) => void;
  onErrorsClear?: () => void;
}

export interface UseFormResult<T extends Record<string, string>> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  handleChange: (field: keyof T) => (value: string) => void;
  setFieldValue: (field: keyof T, value: string) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  clearErrors: () => void;
  clearFieldError: (field: keyof T) => void;
  isDirty: boolean;
}

/**
 * Hook for managing form with multiple fields
 */
export function useForm<T extends Record<string, string>>(
  options: UseFormOptions<T>
): UseFormResult<T> {
  const {
    initialValues,
    validateOnBlur = false,
    clearErrorsOnSubmit = true,
    onFieldChange,
    onErrorsClear,
  } = options;

  type FieldKey = keyof T;

  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Record<FieldKey, string | null>>(
    {} as Record<FieldKey, string | null>
  );
  const [touched, setTouched] = React.useState<Record<FieldKey, boolean>>(
    {} as Record<FieldKey, boolean>
  );

  // Store initial values in ref
  const initialValuesRef = useRef(initialValues);
  const onFieldChangeRef = useRef(onFieldChange);
  const onErrorsClearRef = useRef(onErrorsClear);

  // Update refs
  onFieldChangeRef.current = onFieldChange;
  onErrorsClearRef.current = onErrorsClear;

  const handleChange = useCallback(
    (field: FieldKey) => (value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when field changes (optional)
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }

      // Call external callback
      onFieldChangeRef.current?.(field, value);
    },
    [errors]
  );

  const setFieldValue = useCallback((field: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    onFieldChangeRef.current?.(field, value);
  }, []);

  const setFieldError = useCallback((field: FieldKey, error: string | null) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: FieldKey, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValuesRef.current);
    setErrors({} as Record<FieldKey, string | null>);
    setTouched({} as Record<FieldKey, boolean>);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({} as Record<FieldKey, string | null>);
    onErrorsClearRef.current?.();
  }, []);

  const clearFieldError = useCallback((field: FieldKey) => {
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  // Check if form is dirty (has changes)
  const isDirty = Object.keys(values).some(
    (key) => values[key as FieldKey] !== initialValuesRef.current[key as FieldKey]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    clearErrors,
    clearFieldError,
    isDirty,
  };
}

// Import React for useState
import React from 'react';
