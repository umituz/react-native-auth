/**
 * Password Validation Hook
 * Provides reusable password validation logic with requirements tracking
 */

import { useMemo } from "react";
import {
  validatePasswordForRegister,
  validatePasswordConfirmation,
  type PasswordRequirements,
} from "../../../application/services/ValidationService";
import type { PasswordConfig } from "../../../domain/value-objects/AuthConfig";

interface UsePasswordValidationResult {
  passwordRequirements: PasswordRequirements;
  passwordsMatch: boolean;
  isValid: boolean;
  confirmationError: string | null;
}

interface UsePasswordValidationOptions {
  passwordConfig?: PasswordConfig;
}

/**
 * Hook for password validation with requirements tracking
 * @param password - Password value
 * @param confirmPassword - Confirm password value
 * @param options - Validation options
 * @returns Password validation state
 */
export function usePasswordValidation(
  password: string,
  confirmPassword: string,
  options?: UsePasswordValidationOptions
): UsePasswordValidationResult {
  const config = options?.passwordConfig;

  const passwordRequirements = useMemo((): PasswordRequirements => {
    if (!password || !config) {
      return { hasMinLength: false };
    }
    const result = validatePasswordForRegister(password, config);
    return result.requirements;
  }, [password, config]);

  const passwordsMatch = useMemo(() => {
    if (!password || !confirmPassword) {
      return false;
    }
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const confirmationError = useMemo(() => {
    if (!confirmPassword) {
      return null;
    }
    const result = validatePasswordConfirmation(password, confirmPassword);
    return result.error ?? null;
  }, [password, confirmPassword]);

  const isValid = useMemo(() => {
    return passwordRequirements.hasMinLength && passwordsMatch;
  }, [passwordRequirements, passwordsMatch]);

  return {
    passwordRequirements,
    passwordsMatch,
    isValid,
    confirmationError,
  };
}

