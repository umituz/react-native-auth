/**
 * Field Builder
 * Builds individual form field state and handlers
 */

import { useCallback, useRef } from 'react';
import type { FieldState, FieldChangeHandler, FormFieldConfig } from '../types/FormTypes';

export interface UseFieldOptions extends FormFieldConfig {
  initialValue?: string;
  onValueChange?: (value: string) => void;
  onErrorClear?: () => void;
}

export interface UseFieldResult {
  value: string;
  error: string | null;
  touched: boolean;
  handleChange: FieldChangeHandler;
  setError: (error: string | null) => void;
  setTouched: (touched: boolean) => void;
  reset: () => void;
  clearError: () => void;
}

/**
 * Hook for managing single form field
 */
export function useField(
  options: UseFieldOptions = {}
): UseFieldResult {
  const {
    initialValue = '',
    validateOnChange = false,
    clearErrorOnChange = true,
    onValueChange,
    onErrorClear,
  } = options;

  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  // Store refs to avoid recreating handlers
  const initialValueRef = useRef(initialValue);
  const onValueChangeRef = useRef(onValueChange);
  const onErrorClearRef = useRef(onErrorClear);

  // Update refs
  onValueChangeRef.current = onValueChange;
  onErrorClearRef.current = onErrorClear;

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);

    // Clear error on change if configured
    if (clearErrorOnChange && error) {
      setError(null);
      onErrorClearRef.current?.();
    }

    // Call external callback
    onValueChangeRef.current?.(newValue);
  }, [error, clearErrorOnChange]);

  const reset = useCallback(() => {
    setValue(initialValueRef.current);
    setError(null);
    setTouched(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    onErrorClearRef.current?.();
  }, []);

  return {
    value,
    error,
    touched,
    handleChange,
    setError,
    setTouched,
    reset,
    clearError,
  };
}

// Import React for useState
import React from 'react';
