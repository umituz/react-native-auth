export interface AuthTranslations {
  // Common
  title: string;
  subtitle: string;

  // Login
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signIn: string;
  dontHaveAccount: string;
  createAccount: string;
  orContinueWith: string;

  // Register
  displayName: string;
  displayNamePlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  signUp: string;
  alreadyHaveAccount: string;

  // Social
  google: string;
  apple: string;

  // Legal
  termsOfService: string;
  privacyPolicy: string;

  // Password
  passwordsMatch: string;
  passwordsDontMatch: string;
  passwordReqMinLength: string;

  // Change Password
  changePassword: {
    title: string;
    description: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    submit: string;
    requirements: {
      title: string;
      minLength: string;
      uppercase: string;
      lowercase: string;
      number: string;
      special: string;
    };
    success: {
      title: string;
      message: string;
    };
  };

  // Errors
  errors: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordsNotMatch: string;
    displayNameRequired: string;
    generic: string;
  };

  // Success
  success: {
    loginTitle: string;
    loginMessage: string;
    registerTitle: string;
    registerMessage: string;
  };

  // Auth Bottom Sheet
  close: string;
}

export interface CommonTranslations {
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  edit: string;
  loading: string;
}
