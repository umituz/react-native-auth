/**
 * AuthPackage Tests
 */

import { 
  AuthPackage, 
  initializeAuthPackage, 
  getAuthPackage, 
  resetAuthPackage,
  DEFAULT_AUTH_PACKAGE_CONFIG 
} from '../../../src/infrastructure/services/AuthPackage';
import type { IStorageProvider, IUIProvider, IValidationProvider } from '../../../src/infrastructure/services/AuthPackage';

describe('AuthPackage', () => {
  let mockStorageProvider: jest.Mocked<IStorageProvider>;
  let mockUIProvider: jest.Mocked<IUIProvider>;
  let mockValidationProvider: jest.Mocked<IValidationProvider>;

  beforeEach(() => {
    mockStorageProvider = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    };

    mockUIProvider = {
      getTheme: jest.fn(),
      getLocalization: jest.fn(),
    };

    mockValidationProvider = {
      validateEmail: jest.fn(),
      validatePassword: jest.fn(),
    };

    // Reset package state
    resetAuthPackage();
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      const authPackage = new AuthPackage();
      const config = authPackage.getConfig();
      
      expect(config).toEqual(DEFAULT_AUTH_PACKAGE_CONFIG);
    });

    it('should merge custom config with defaults', () => {
      const customConfig = {
        storageKeys: {
          guestMode: '@custom_guest_mode',
          showRegister: 'custom_show_register',
        },
        features: {
          guestMode: false,
          registration: false,
          passwordStrength: false,
        },
      };

      const authPackage = new AuthPackage(customConfig);
      const config = authPackage.getConfig();
      
      expect(config.storageKeys).toEqual(customConfig.storageKeys);
      expect(config.features).toEqual(customConfig.features);
      expect(config.validation).toEqual(DEFAULT_AUTH_PACKAGE_CONFIG.validation);
      expect(config.ui).toEqual(DEFAULT_AUTH_PACKAGE_CONFIG.ui);
    });

    it('should deeply merge nested config', () => {
      const customConfig = {
        validation: {
          passwordConfig: {
            minLength: 12,
            requireUppercase: true,
          },
        },
      };

      const authPackage = new AuthPackage(customConfig);
      const config = authPackage.getConfig();
      
      expect(config.validation.passwordConfig.minLength).toBe(12);
      expect(config.validation.passwordConfig.requireUppercase).toBe(true);
      expect(config.validation.passwordConfig.requireLowercase).toBe(true); // Should keep default
    });
  });

  describe('provider setters and getters', () => {
    let authPackage: AuthPackage;

    beforeEach(() => {
      authPackage = new AuthPackage();
    });

    it('should set and get storage provider', () => {
      authPackage.setStorageProvider(mockStorageProvider);
      expect(authPackage.getStorageProvider()).toBe(mockStorageProvider);
    });

    it('should set and get UI provider', () => {
      authPackage.setUIProvider(mockUIProvider);
      expect(authPackage.getUIProvider()).toBe(mockUIProvider);
    });

    it('should set and get validation provider', () => {
      authPackage.setValidationProvider(mockValidationProvider);
      expect(authPackage.getValidationProvider()).toBe(mockValidationProvider);
    });
  });

  describe('isFeatureEnabled', () => {
    let authPackage: AuthPackage;

    beforeEach(() => {
      authPackage = new AuthPackage();
    });

    it('should return feature status from config', () => {
      expect(authPackage.isFeatureEnabled('guestMode')).toBe(true);
      expect(authPackage.isFeatureEnabled('registration')).toBe(true);
      expect(authPackage.isFeatureEnabled('passwordStrength')).toBe(true);
    });

    it('should return custom feature status', () => {
      const customConfig = {
        features: {
          guestMode: false,
          registration: false,
          passwordStrength: false,
        },
      };

      const customPackage = new AuthPackage(customConfig);
      
      expect(customPackage.isFeatureEnabled('guestMode')).toBe(false);
      expect(customPackage.isFeatureEnabled('registration')).toBe(false);
      expect(customPackage.isFeatureEnabled('passwordStrength')).toBe(false);
    });
  });

  describe('global package instance', () => {
    it('should initialize package globally', () => {
      const customConfig = {
        storageKeys: {
          guestMode: '@global_guest_mode',
        },
      };

      const packageInstance = initializeAuthPackage(customConfig);
      expect(packageInstance.getConfig().storageKeys.guestMode).toBe('@global_guest_mode');
    });

    it('should return existing package instance', () => {
      const firstInstance = initializeAuthPackage();
      const secondInstance = getAuthPackage();
      
      expect(firstInstance).toBe(secondInstance);
    });

    it('should return null when no package initialized', () => {
      resetAuthPackage();
      const packageInstance = getAuthPackage();
      expect(packageInstance).toBeNull();
    });

    it('should not reinitialize when already initialized', () => {
      const firstInstance = initializeAuthPackage();
      const secondInstance = initializeAuthPackage({
        storageKeys: { guestMode: '@different' },
      });
      
      expect(firstInstance).toBe(secondInstance);
      expect(secondInstance.getConfig().storageKeys.guestMode).toBe('@auth_guest_mode'); // Should keep original
    });

    it('should reset package instance', () => {
      initializeAuthPackage();
      expect(getAuthPackage()).not.toBeNull();
      
      resetAuthPackage();
      expect(getAuthPackage()).toBeNull();
    });
  });

  describe('provider integration', () => {
    let authPackage: AuthPackage;

    beforeEach(() => {
      authPackage = new AuthPackage();
      authPackage.setStorageProvider(mockStorageProvider);
      authPackage.setUIProvider(mockUIProvider);
      authPackage.setValidationProvider(mockValidationProvider);
    });

    it('should integrate all providers', () => {
      expect(authPackage.getStorageProvider()).toBe(mockStorageProvider);
      expect(authPackage.getUIProvider()).toBe(mockUIProvider);
      expect(authPackage.getValidationProvider()).toBe(mockValidationProvider);
    });
  });

  describe('config validation', () => {
    it('should handle empty config', () => {
      const authPackage = new AuthPackage({});
      const config = authPackage.getConfig();
      
      expect(config).toEqual(DEFAULT_AUTH_PACKAGE_CONFIG);
    });

    it('should handle partial config', () => {
      const partialConfig = {
        features: {
          guestMode: false,
        },
      };

      const authPackage = new AuthPackage(partialConfig);
      const config = authPackage.getConfig();
      
      expect(config.features.guestMode).toBe(false);
      expect(config.features.registration).toBe(true); // Should keep default
      expect(config.features.passwordStrength).toBe(true); // Should keep default
    });
  });
});