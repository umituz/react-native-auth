/**
 * Profile Edit Hook
 * Simple profile editing with form state management
 * Apps provide image picker and backend update logic
 */

import { useState, useCallback } from "react";
import { validateProfileForm } from "../utils/form/formValidation.util";

export interface ProfileEditFormState {
  displayName: string;
  email: string;
  photoURL: string | null;
  isModified: boolean;
}

export interface UseProfileEditReturn {
  formState: ProfileEditFormState;
  setDisplayName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhotoURL: (value: string | null) => void;
  resetForm: (initial: Partial<ProfileEditFormState>) => void;
  validateForm: () => { isValid: boolean; errors: string[] };
}

export const useProfileEdit = (
  initialState: Partial<ProfileEditFormState> = {},
): UseProfileEditReturn => {
  const [formState, setFormState] = useState<ProfileEditFormState>({
    displayName: initialState.displayName || "",
    email: initialState.email || "",
    photoURL: initialState.photoURL || null,
    isModified: false,
  });

  const setDisplayName = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, displayName: value, isModified: true }));
  }, []);

  const setEmail = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, email: value, isModified: true }));
  }, []);

  const setPhotoURL = useCallback((value: string | null) => {
    setFormState((prev) => ({ ...prev, photoURL: value, isModified: true }));
  }, []);

  const resetForm = useCallback((initial: Partial<ProfileEditFormState>) => {
    setFormState({
      displayName: initial.displayName || "",
      email: initial.email || "",
      photoURL: initial.photoURL || null,
      isModified: false,
    });
  }, []);

  const validateForm = useCallback((): {
    isValid: boolean;
    errors: string[];
  } => {
    const result = validateProfileForm({
      displayName: formState.displayName,
      email: formState.email,
    });

    return {
      isValid: result.isValid,
      errors: result.errors.map((e) => e.message),
    };
  }, [formState]);

  return {
    formState,
    setDisplayName,
    setEmail,
    setPhotoURL,
    resetForm,
    validateForm,
  };
};
