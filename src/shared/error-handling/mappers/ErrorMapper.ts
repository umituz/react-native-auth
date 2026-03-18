/**
 * Error Mapper
 * Maps errors to localization keys
 */

import type { ErrorMap, ErrorMappingConfig } from '../types/ErrorTypes';

export class ErrorMapper {
  private config: ErrorMappingConfig;

  constructor(config: ErrorMappingConfig = {}) {
    this.config = {
      errorCodeMap: config.errorCodeMap || {},
      errorNameMap: config.errorNameMap || {},
      defaultKey: config.defaultKey || 'auth.errors.unknownError',
    };
  }

  /**
   * Map error code to localization key
   */
  getLocalizationKey(error: unknown): string {
    // Handle non-Error types
    if (!(error instanceof Error)) {
      return this.config.defaultKey!;
    }

    const code = (error as any).code;
    const name = error.name;

    // First check by error name (most specific)
    if (this.config.errorNameMap && name && this.config.errorNameMap[name]) {
      return this.config.errorNameMap[name];
    }

    // Then check by error code
    if (this.config.errorCodeMap && code && this.config.errorCodeMap[code]) {
      return this.config.errorCodeMap[code];
    }

    // Default to unknown error
    return this.config.defaultKey!;
  }

  /**
   * Resolve error key to localized message
   */
  resolveMessage(key: string, translations?: ErrorMap): string {
    return translations?.[key] || key;
  }

  /**
   * Get error message with translations
   */
  getErrorMessage(error: unknown, translations?: ErrorMap): string {
    const key = this.getLocalizationKey(error);
    return this.resolveMessage(key, translations);
  }

  /**
   * Set error mappings
   */
  setMappings(config: Partial<ErrorMappingConfig>): void {
    if (config.errorCodeMap) {
      this.config.errorCodeMap = { ...this.config.errorCodeMap, ...config.errorCodeMap };
    }
    if (config.errorNameMap) {
      this.config.errorNameMap = { ...this.config.errorNameMap, ...config.errorNameMap };
    }
    if (config.defaultKey) {
      this.config.defaultKey = config.defaultKey;
    }
  }
}

/**
 * Default auth error mappings
 */
export const DEFAULT_AUTH_ERROR_MAPPINGS: ErrorMappingConfig = {
  errorCodeMap: {
    AUTH_INVALID_EMAIL: 'auth.errors.invalidEmail',
    AUTH_WEAK_PASSWORD: 'auth.errors.weakPassword',
    AUTH_USER_NOT_FOUND: 'auth.errors.userNotFound',
    AUTH_WRONG_PASSWORD: 'auth.errors.wrongPassword',
    AUTH_EMAIL_ALREADY_IN_USE: 'auth.errors.emailAlreadyInUse',
    AUTH_NETWORK_ERROR: 'auth.errors.networkError',
    AUTH_CONFIG_ERROR: 'auth.errors.configurationError',
    AUTH_TOO_MANY_REQUESTS: 'auth.errors.tooManyRequests',
    AUTH_USER_DISABLED: 'auth.errors.userDisabled',
    AUTH_NOT_INITIALIZED: 'auth.errors.authNotInitialized',
    AUTH_INVALID_CREDENTIAL: 'auth.errors.invalidCredential',
    // Firebase error codes
    'auth/invalid-email': 'auth.errors.invalidEmail',
    'auth/weak-password': 'auth.errors.weakPassword',
    'auth/user-not-found': 'auth.errors.invalidCredential',
    'auth/wrong-password': 'auth.errors.invalidCredential',
    'auth/email-already-in-use': 'auth.errors.emailAlreadyInUse',
    'auth/network-request-failed': 'auth.errors.networkError',
    'auth/too-many-requests': 'auth.errors.tooManyRequests',
    'auth/user-disabled': 'auth.errors.userDisabled',
    'auth/invalid-credential': 'auth.errors.invalidCredential',
    'auth/invalid-login-credentials': 'auth.errors.invalidCredential',
  },
  errorNameMap: {
    AuthInvalidEmailError: 'auth.errors.invalidEmail',
    AuthWeakPasswordError: 'auth.errors.weakPassword',
    AuthUserNotFoundError: 'auth.errors.userNotFound',
    AuthWrongPasswordError: 'auth.errors.wrongPassword',
    AuthEmailAlreadyInUseError: 'auth.errors.emailAlreadyInUse',
    AuthNetworkError: 'auth.errors.networkError',
    AuthConfigurationError: 'auth.errors.configurationError',
    AuthInitializationError: 'auth.errors.authNotInitialized',
  },
  defaultKey: 'auth.errors.unknownError',
};
