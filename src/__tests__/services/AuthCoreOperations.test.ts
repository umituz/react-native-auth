import { AuthCoreService } from '../../../src/infrastructure/services/AuthCoreService';
import { DEFAULT_AUTH_CONFIG } from '../../../src/domain/value-objects/AuthConfig';
import type { IAuthProvider } from '../../../src/application/ports/IAuthProvider';
import type { AuthUser } from '../../../src/domain/entities/AuthUser';

describe('AuthCoreOperations', () => {
  let authCoreService: AuthCoreService;
  let mockProvider: jest.Mocked<IAuthProvider>;
  const mockUser: AuthUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    isAnonymous: false,
    emailVerified: false,
    photoURL: null,
  };

  beforeEach(async () => {
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
    await authCoreService.initialize(mockProvider);
  });

  describe('Auth Flow', () => {
    it('should sign up successfully', async () => {
      mockProvider.signUp.mockResolvedValue(mockUser);
      const result = await authCoreService.signUp({ email: 'test@example.com', password: 'password123' });
      expect(result).toEqual(mockUser);
    });

    it('should sign in successfully', async () => {
      mockProvider.signIn.mockResolvedValue(mockUser);
      const result = await authCoreService.signIn({ email: 'test@example.com', password: 'password123' });
      expect(result).toEqual(mockUser);
    });

    it('should sign out successfully', async () => {
      await authCoreService.signOut();
      expect(mockProvider.signOut).toHaveBeenCalled();
    });
  });

  describe('User State', () => {
    it('should return current user', () => {
      mockProvider.getCurrentUser.mockReturnValue(mockUser);
      expect(authCoreService.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when no user', () => {
      mockProvider.getCurrentUser.mockReturnValue(null);
      expect(authCoreService.getCurrentUser()).toBeNull();
    });

    it('should subscribe to auth state changes', () => {
      const callback = jest.fn();
      const mockCleanup = jest.fn();
      mockProvider.onAuthStateChange.mockReturnValue(mockCleanup);
      const cleanup = authCoreService.onAuthStateChange(callback);
      expect(mockProvider.onAuthStateChange).toHaveBeenCalledWith(callback);
      expect(cleanup).toBe(mockCleanup);
    });
  });
});