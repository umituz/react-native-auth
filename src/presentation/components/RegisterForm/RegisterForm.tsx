/**
 * Register Form Component
 * Main registration form with error display and actions
 */

import React, { memo } from 'react';
import { AtomicButton } from '@umituz/react-native-design-system/atoms';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { AuthErrorDisplay } from '../AuthErrorDisplay';
import { AuthLink } from '../AuthLink';
import { AuthLegalLinks } from '../AuthLegalLinks';
import { RegisterFormFields } from './RegisterFormFields';
import { styles } from './styles';
import type { RegisterFormProps } from './types';

export const RegisterForm = memo<RegisterFormProps>(({
  translations,
  onNavigateToLogin,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
  const {
    displayName,
    email,
    password,
    confirmPassword,
    fieldErrors,
    loading,
    passwordRequirements,
    passwordsMatch,
    handleDisplayNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSignUp,
    displayError,
  } = useRegisterForm();

  return (
    <>
      <RegisterFormFields
        displayName={displayName}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        fieldErrors={fieldErrors}
        loading={loading}
        passwordRequirements={passwordRequirements}
        passwordsMatch={passwordsMatch}
        translations={translations}
        onDisplayNameChange={handleDisplayNameChange}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
        onSubmit={handleSignUp}
      />

      <AuthErrorDisplay error={displayError} />

      <AtomicButton
        variant="primary"
        onPress={() => {
          handleSignUp().catch(() => {});
        }}
        disabled={loading || !email.trim() || !password || !confirmPassword}
        fullWidth
        style={styles.signUpButton}
      >
        {translations.signUp}
      </AtomicButton>

      <AuthLink
        text={translations.alreadyHaveAccount}
        linkText={translations.signIn}
        onPress={onNavigateToLogin}
        disabled={loading}
      />

      <AuthLegalLinks
        translations={translations.legal}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
        onTermsPress={onTermsPress}
        onPrivacyPress={onPrivacyPress}
        prefixText={translations.bySigningUp}
      />
    </>
  );
});

RegisterForm.displayName = 'RegisterForm';
