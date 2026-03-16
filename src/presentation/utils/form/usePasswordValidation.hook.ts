/**
 * Password Validation Hook
 * Provides reusable password validation logic with requirements tracking
 * PERFORMANCE: Single useMemo using passwordStrengthCalculator utility
 */

import { useMemo } from "react";
import type { PasswordRequirements } from "../../../infrastructure/utils/validation/types";
import type { PasswordConfig } from "../../../domain/value-objects/AuthConfig";
import { calculatePasswordValidation } from "../../../infrastructure/utils/calculators/passwordStrengthCalculator";

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
  // PERFORMANCE: Use utility function for batch calculation
  const result = useMemo(() => {
    const validation = calculatePasswordValidation({
      password,
      confirmPassword,
      config: options?.passwordConfig,
    });

    // Map to expected return type
    return {
      passwordRequirements: validation.requirements,
      passwordsMatch: validation.passwordsMatch,
      isValid: validation.isValid,
      confirmationError: validation.confirmationError,
    };
  }, [password, confirmPassword, options?.passwordConfig]);

  return result;
}

