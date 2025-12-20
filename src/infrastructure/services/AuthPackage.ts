/**
 * Auth Package Configuration
 * Centralized configuration for the auth package
 */

import type { AuthConfig, PasswordConfig } from "../../domain/value-objects/AuthConfig";

export interface AuthPackageConfig {
  storageKeys: {
    guestMode: string;
    showRegister: string;
  };
  validation: {
    emailRegex: RegExp;
    passwordConfig: PasswordConfig;
  };
  ui: {
    theme?: any;
    localization?: any;
  };
  features: {
    guestMode: boolean;
    registration: boolean;
    passwordStrength: boolean;
  };
}

export const DEFAULT_AUTH_PACKAGE_CONFIG: AuthPackageConfig = {
  storageKeys: {
    guestMode: "@auth_guest_mode",
    showRegister: "auth_show_register",
  },
  validation: {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordConfig: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: false,
    },
  },
  ui: {
    theme: undefined,
    localization: undefined,
  },
  features: {
    guestMode: true,
    registration: true,
    passwordStrength: true,
  },
};

export interface IStorageProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface IUIProvider {
  getTheme(): any;
  getLocalization(): any;
}

export interface IValidationProvider {
  validateEmail(email: string): { isValid: boolean; error?: string };
  validatePassword(password: string, config: PasswordConfig): { isValid: boolean; error?: string };
}

export class AuthPackage {
  private config: AuthPackageConfig;
  private storageProvider?: IStorageProvider;
  private uiProvider?: IUIProvider;
  private validationProvider?: IValidationProvider;

  constructor(config: Partial<AuthPackageConfig> = {}) {
    this.config = {
      ...DEFAULT_AUTH_PACKAGE_CONFIG,
      ...config,
      validation: {
        ...DEFAULT_AUTH_PACKAGE_CONFIG.validation,
        ...config.validation,
        passwordConfig: {
          ...DEFAULT_AUTH_PACKAGE_CONFIG.validation.passwordConfig,
          ...config.validation?.passwordConfig,
        },
      },
      ui: {
        ...DEFAULT_AUTH_PACKAGE_CONFIG.ui,
        ...config.ui,
      },
      features: {
        ...DEFAULT_AUTH_PACKAGE_CONFIG.features,
        ...config.features,
      },
    };
  }

  setStorageProvider(provider: IStorageProvider): void {
    this.storageProvider = provider;
  }

  setUIProvider(provider: IUIProvider): void {
    this.uiProvider = provider;
  }

  setValidationProvider(provider: IValidationProvider): void {
    this.validationProvider = provider;
  }

  getConfig(): AuthPackageConfig {
    return this.config;
  }

  getStorageProvider(): IStorageProvider | undefined {
    return this.storageProvider;
  }

  getUIProvider(): IUIProvider | undefined {
    return this.uiProvider;
  }

  getValidationProvider(): IValidationProvider | undefined {
    return this.validationProvider;
  }

  isFeatureEnabled(feature: keyof AuthPackageConfig['features']): boolean {
    return this.config.features[feature];
  }
}

// Global package instance
let packageInstance: AuthPackage | null = null;

export function initializeAuthPackage(config: Partial<AuthPackageConfig> = {}): AuthPackage {
  if (!packageInstance) {
    packageInstance = new AuthPackage(config);
  }
  return packageInstance;
}

export function getAuthPackage(): AuthPackage | null {
  return packageInstance;
}

export function resetAuthPackage(): void {
  packageInstance = null;
}