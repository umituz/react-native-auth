/**
 * Register Form Fields
 * Individual form field components for registration
 */

import React, { useRef } from 'react';
import { TextInput } from 'react-native';
import { FormTextInput } from '../form/FormTextInput';
import { FormEmailInput } from '../form/FormEmailInput';
import { FormPasswordInput } from '../form/FormPasswordInput';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { PasswordMatchIndicator } from '../PasswordMatchIndicator';
import type { RegisterFormTranslations } from './types';
import type { PasswordRequirements } from '@shared/validation/types';

export interface RegisterFormFieldsProps {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fieldErrors: Record<string, string | null>;
  loading: boolean;
  passwordRequirements: PasswordRequirements;
  passwordsMatch: boolean;
  translations: RegisterFormTranslations;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
}

export const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  displayName,
  email,
  password,
  confirmPassword,
  fieldErrors,
  loading,
  passwordRequirements,
  passwordsMatch,
  translations,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  const emailRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const passwordRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const confirmPasswordRef = useRef<React.ElementRef<typeof TextInput>>(null);

  return (
    <>
      <FormTextInput
        value={displayName}
        onChangeText={onDisplayNameChange}
        label={translations.displayName}
        placeholder={translations.displayNamePlaceholder}
        error={fieldErrors.displayName}
        disabled={loading}
        autoCapitalize="words"
        onSubmitEditing={() => emailRef.current?.focus()}
        returnKeyType="next"
      />

      <FormEmailInput
        ref={emailRef}
        value={email}
        onChangeText={onEmailChange}
        label={translations.email}
        placeholder={translations.emailPlaceholder}
        error={fieldErrors.email}
        disabled={loading}
        onSubmitEditing={() => passwordRef.current?.focus()}
        returnKeyType="next"
      />

      <FormPasswordInput
        ref={passwordRef}
        value={password}
        onChangeText={onPasswordChange}
        label={translations.password}
        placeholder={translations.passwordPlaceholder}
        error={fieldErrors.password}
        disabled={loading}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        returnKeyType="next"
        style={{ marginBottom: 4 }}
      />
      {password.length > 0 && (
        <PasswordStrengthIndicator
          translations={translations.passwordStrength}
          requirements={passwordRequirements}
        />
      )}

      <FormPasswordInput
        ref={confirmPasswordRef}
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        label={translations.confirmPassword}
        placeholder={translations.confirmPasswordPlaceholder}
        error={fieldErrors.confirmPassword}
        disabled={loading}
        onSubmitEditing={() => void onSubmit()}
        returnKeyType="done"
        style={{ marginBottom: 4 }}
      />
      {confirmPassword.length > 0 && (
        <PasswordMatchIndicator
          translations={translations.passwordMatch}
          isMatch={passwordsMatch}
        />
      )}
    </>
  );
};
