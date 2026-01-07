import { AuthCoreService } from '../../../src/infrastructure/services/AuthCoreService';
import { DEFAULT_AUTH_CONFIG } from '../../../src/domain/value-objects/AuthConfig';
import type { IAuthProvider } from '../../../src/application/ports/IAuthProvider';

describe('AuthCoreInitialization', () => {
  let authCoreService: AuthCoreService;
  let mockProvider: jest.Mocked<IAuthProvider>;

  beforeEach(() => {
    mockProvider = {
      initialize: jest.fn(),
      isInitialized: jest.fn().mockReturnValue(true),
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue(jest.fn()),
    };
    authCoreService = new AuthCoreService(DEFAULT_AUTH_CONFIG);
  });

  it('should initialize with provided config', () => {
    const customConfig = { ...DEFAULT_AUTH_CONFIG, password: { ...DEFAULT_AUTH_CONFIG.password, minLength: 12 } };
    const service = new AuthCoreService(customConfig);
    expect(service.getConfig()).toEqual(customConfig);
  });

  it('should initialize with IAuthProvider', async () => {
    await authCoreService.initialize(mockProvider);
    expect(mockProvider.initialize).toHaveBeenCalled();
  });

  it('should throw error when no provider provided', async () => {
    await expect(authCoreService.initialize(null as any)).rejects.toThrow();
  });

  it('should return false when not initialized', () => {
    expect(authCoreService.isInitialized()).toBe(false);
  });

  it('should return true when initialized', async () => {
    await authCoreService.initialize(mockProvider);
    expect(authCoreService.isInitialized()).toBe(true);
  });
});