/**
 * useLoginForm Hook
 * Single Responsibility: Handle login form logic
 */

import { useState, useCallback } from "react";
import { useLocalization } from "@umituz/react-native-localization";
import { useAuth } from "./useAuth";
import { getAuthErrorLocalizationKey } from "../utils/getAuthErrorMessage";
import { validateEmail } from "../../infrastructure/utils/AuthValidation";

export interface UseLoginFormResult {
  email: string;
  password: string;
  emailError: string | null;
  passwordError: string | null;
  localError: string | null;
  loading: boolean;
  handleEmailChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleSignIn: () => Promise<void>;
  handleContinueAsGuest: () => Promise<void>;
  displayError: string | null;
}

/**
 * Hook for login form logic
 */
export function useLoginForm(): UseLoginFormResult {
  const { t } = useLocalization();
  const { signIn, loading, error, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    if (emailError) setEmailError(null);
    if (localError) setLocalError(null);
  }, [emailError, localError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(null);
    if (localError) setLocalError(null);
  }, [passwordError, localError]);

  const handleSignIn = useCallback(async () => {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.log("[useLoginForm] handleSignIn called");
    }
    setEmailError(null);
    setPasswordError(null);
    setLocalError(null);

    let hasError = false;

    const emailResult = validateEmail(email.trim());
    if (!emailResult.isValid) {
      setEmailError(t("auth.errors.invalidEmail"));
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError(t("auth.errors.weakPassword"));
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError(t("auth.errors.weakPassword"));
      hasError = true;
    }

    if (hasError) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useLoginForm] Validation errors, returning early");
      }
      return;
    }

    try {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useLoginForm] Calling signIn with email:", email.trim());
      }
      await signIn(email.trim(), password);
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useLoginForm] signIn completed successfully");
      }
    } catch (err: any) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.error("[useLoginForm] signIn error:", err);
      }
      const localizationKey = getAuthErrorLocalizationKey(err);
      const errorMessage = t(localizationKey);
      setLocalError(errorMessage);
    }
  }, [email, password, t, signIn]);

  const handleContinueAsGuest = useCallback(async () => {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.log("========================================");
      console.log("[useLoginForm] 🎯 Continue as Guest button PRESSED");
      console.log("[useLoginForm] Current loading state:", loading);
      console.log("[useLoginForm] Current error state:", error);
      console.log("========================================");
    }
    
    try {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useLoginForm] Calling continueAsGuest() function...");
      }
      
      await continueAsGuest();
      
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.log("[useLoginForm] ✅ continueAsGuest() completed successfully");
        console.log("[useLoginForm] Current loading state after:", loading);
      }
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.error("[useLoginForm] ❌ ERROR in continueAsGuest:", err);
        console.error("[useLoginForm] Error details:", {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    }
  }, [continueAsGuest, loading, error]);

  const displayError = localError || error;

  return {
    email,
    password,
    emailError,
    passwordError,
    localError,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleSignIn,
    handleContinueAsGuest,
    displayError,
  };
}

