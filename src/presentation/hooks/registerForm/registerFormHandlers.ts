/**
 * Register Form Change Handlers
 * Input field change handlers with error clearing
 */

import { useCallback } from "react";
import type { FieldErrors } from "./useRegisterForm.types";
import { clearFieldError, clearFieldErrors } from "../../utils/form/formErrorUtils";

export function useRegisterFormHandlers(
  updateField: (field: string, value: string) => void,
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
  clearLocalError: () => void
) {
  const handleDisplayNameChange = useCallback(
    (text: string) => {
      updateField("displayName", text);
      clearFieldError(setFieldErrors, "displayName");
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handleEmailChange = useCallback(
    (text: string) => {
      updateField("email", text);
      clearFieldError(setFieldErrors, "email");
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      updateField("password", text);
      clearFieldErrors(setFieldErrors, ["password", "confirmPassword"]);
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      updateField("confirmPassword", text);
      clearFieldError(setFieldErrors, "confirmPassword");
      clearLocalError();
    },
    [updateField, clearLocalError]
  );

  return {
    handleDisplayNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
  };
}
