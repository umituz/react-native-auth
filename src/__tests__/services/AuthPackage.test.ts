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
    mockStorageProvider = { get: jest.fn(), set: jest.fn(), remove: jest.fn() };
    mockUIProvider = { getTheme: jest.fn(), getLocalization: jest.fn() };
    mockValidationProvider = { validateEmail: jest.fn(), validatePassword: jest.fn() };
    resetAuthPackage();
  });

  describe('constructor', () => {
    it('should initialize with default config', () => {
      expect(new AuthPackage().getConfig()).toEqual(DEFAULT_AUTH_PACKAGE_CONFIG);
    });

    it('should merge custom config and deeply nested config', () => {
      const customConfig = { features: { anonymousMode: false }, validation: { passwordConfig: { minLength: 12 } } };
      const authPackage = new AuthPackage(customConfig);
      const config = authPackage.getConfig();
      expect(config.features.anonymousMode).toBe(false);
      expect(config.validation.passwordConfig.minLength).toBe(12);
      expect(config.validation.passwordConfig.requireLowercase).toBe(true);
    });
  });

  describe('provider management', () => {
    it('should set and get providers', () => {
      const authPackage = new AuthPackage();
      authPackage.setStorageProvider(mockStorageProvider);
      authPackage.setUIProvider(mockUIProvider);
      authPackage.setValidationProvider(mockValidationProvider);
      expect(authPackage.getStorageProvider()).toBe(mockStorageProvider);
      expect(authPackage.getUIProvider()).toBe(mockUIProvider);
      expect(authPackage.getValidationProvider()).toBe(mockValidationProvider);
    });
  });

  describe('feature flags', () => {
    it('should return feature status from config', () => {
      const authPackage = new AuthPackage({ features: { anonymousMode: false } });
      expect(authPackage.isFeatureEnabled('anonymousMode')).toBe(false);
      expect(authPackage.isFeatureEnabled('registration')).toBe(true);
    });
  });

  describe('global instance', () => {
    it('should manage global instances correctly', () => {
      const instance = initializeAuthPackage({ storageKeys: { anonymousMode: '@custom' } });
      expect(getAuthPackage()).toBe(instance);
      expect(getAuthPackage()?.getConfig().storageKeys.anonymousMode).toBe('@custom');
      
      resetAuthPackage();
      expect(getAuthPackage()).toBeNull();
    });

    it('should return null when not initialized', () => {
      resetAuthPackage();
      expect(getAuthPackage()).toBeNull();
    });

    it('should handle partial config', () => {
      const authPackage = new AuthPackage({ features: { anonymousMode: false } });
      const config = authPackage.getConfig();
      expect(config.features.anonymousMode).toBe(false);
      expect(config.features.registration).toBe(true);
    });
  });
});