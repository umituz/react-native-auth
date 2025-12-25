/**
 * useRegisterForm Hook
 * Single Responsibility: Handle register form logic
 */

import { useState, useCallback, useMemo } from "react";
import { useLocalization } from "@umituz/react-native-localization";
import {
  validateEmail,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from "../../infrastructure/utils/AuthValidation";
import { DEFAULT_PASSWORD_CONFIG } from "../../domain/value-objects/AuthConfig";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";
import type { PasswordRequirements } from "../../infrastructure/utils/AuthValidation";

export interface UseRegisterFormResult {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fieldErrors: {
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  localError: string | null;
  loading: boolean;
  passwordRequirements: PasswordRequirements;
  passwordsMatch: boolean;
  handleDisplayNameChange: (text: string) => void;
  handleEmailChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;
  handleSignUp: () => Promise<void>;
  displayError: string | null;
}

/**
 * Hook for register form logic
 */
export function useRegisterForm(): UseRegisterFormResult {
  const { t } = useLocalization();
  const { signUp, loading, error } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordRequirements = useMemo((): PasswordRequirements => {
    if (!password) {
      return {
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      };
    }
    const result = validatePasswordForRegister(password, DEFAULT_PASSWORD_CONFIG);
    return result.requirements;
  }, [password]);

  const passwordsMatch = useMemo(() => {
    return password.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const handleDisplayNameChange = useCallback((text: string) => {
    setDisplayName(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.displayName) {
        delete next.displayName;
      }
      return next;
    });
    setLocalError(null);
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.email) {
        delete next.email;
      }
      return next;
    });
    setLocalError(null);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.password) {
        delete next.password;
      }
      if (next.confirmPassword) {
        delete next.confirmPassword;
      }
      return next;
    });
    setLocalError(null);
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next.confirmPassword) {
        delete next.confirmPassword;
      }
      return next;
    });
    setLocalError(null);
  }, []);

  const handleSignUp = useCallback(async () => {
    setLocalError(null);
    setFieldErrors({});

    const emailResult = validateEmail(email.trim());
    if (!emailResult.isValid) {
      setFieldErrors((prev) => ({ ...prev, email: emailResult.error }));
      return;
    }

    const passwordResult = validatePasswordForRegister(password, DEFAULT_PASSWORD_CONFIG);
    if (!passwordResult.isValid) {
      setFieldErrors((prev) => ({ ...prev, password: passwordResult.error }));
      return;
    }

    const confirmResult = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmResult.isValid) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmResult.error }));
      return;
    }

    try {
      await signUp(
        email.trim(),
        password,
        displayName.trim() || undefined,
      );
    } catch (err: unknown) {
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = t(localizationKey);
      setLocalError(errorMessage);
    }
  }, [displayName, email, password, confirmPassword, signUp, t]);

  const displayError = localError || error;

  return {
    displayName,
    email,
    password,
    confirmPassword,
    fieldErrors,
    localError,
    loading,
    passwordRequirements,
    passwordsMatch,
    handleDisplayNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSignUp,
    displayError,
  };
}


