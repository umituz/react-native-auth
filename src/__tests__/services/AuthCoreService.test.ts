/**
 * AuthCoreService Tests
 */

import { AuthCoreService } from '../../../src/infrastructure/services/AuthCoreService';
import { DEFAULT_AUTH_CONFIG } from '../../../src/domain/value-objects/AuthConfig';
import type { IAuthProvider } from '../../../src/application/ports/IAuthProvider';
import type { AuthUser } from '../../../src/domain/entities/AuthUser';

describe('AuthCoreService', () => {
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

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      const customConfig = {
        ...DEFAULT_AUTH_CONFIG,
        password: {
          ...DEFAULT_AUTH_CONFIG.password,
          minLength: 12,
        },
      };

      const service = new AuthCoreService(customConfig);
      expect(service.getConfig()).toEqual(customConfig);
    });
  });

  describe('initialize', () => {
    it('should initialize with IAuthProvider', async () => {
      await authCoreService.initialize(mockProvider);
      expect(mockProvider.initialize).toHaveBeenCalled();
    });

    it('should initialize with Firebase Auth instance', async () => {
      const mockFirebaseAuth = {
        currentUser: null,
      } as any;

      await expect(authCoreService.initialize(mockFirebaseAuth)).rejects.toThrow();
    });

    it('should throw error when no provider provided', async () => {
      await expect(authCoreService.initialize(null as any)).rejects.toThrow(
        'Auth provider or Firebase Auth instance is required'
      );
    });
  });

  describe('isInitialized', () => {
    it('should return false when not initialized', () => {
      expect(authCoreService.isInitialized()).toBe(false);
    });

    it('should return true when initialized', async () => {
      await authCoreService.initialize(mockProvider);
      expect(authCoreService.isInitialized()).toBe(true);
    });
  });

  describe('signUp', () => {
    const mockUser: AuthUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      isAnonymous: false,
      emailVerified: false,
      photoURL: null,
    };

    beforeEach(async () => {
      await authCoreService.initialize(mockProvider);
    });

    it('should sign up successfully with valid credentials', async () => {
      mockProvider.signUp.mockResolvedValue(mockUser);

      const result = await authCoreService.signUp({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });

      expect(result).toEqual(mockUser);
      expect(mockProvider.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });
    });

    it('should sign up without display name', async () => {
      mockProvider.signUp.mockResolvedValue(mockUser);

      await authCoreService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockProvider.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        displayName: undefined,
      });
    });

    it('should throw error when not initialized', async () => {
      const uninitializedService = new AuthCoreService(DEFAULT_AUTH_CONFIG);
      
      await expect(uninitializedService.signUp({
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('Auth service is not initialized');
    });
  });

  describe('signIn', () => {
    const mockUser: AuthUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      isAnonymous: false,
      emailVerified: false,
      photoURL: null,
    };

    beforeEach(async () => {
      await authCoreService.initialize(mockProvider);
    });

    it('should sign in successfully with valid credentials', async () => {
      mockProvider.signIn.mockResolvedValue(mockUser);

      const result = await authCoreService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
      expect(mockProvider.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw error when not initialized', async () => {
      const uninitializedService = new AuthCoreService(DEFAULT_AUTH_CONFIG);
      
      await expect(uninitializedService.signIn({
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('Auth service is not initialized');
    });
  });

  describe('signOut', () => {
    beforeEach(async () => {
      await authCoreService.initialize(mockProvider);
    });

    it('should sign out successfully', async () => {
      await authCoreService.signOut();
      expect(mockProvider.signOut).toHaveBeenCalled();
    });

    it('should handle sign out when not initialized', async () => {
      const uninitializedService = new AuthCoreService(DEFAULT_AUTH_CONFIG);
      
      await expect(uninitializedService.signOut()).resolves.not.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    const mockUser: AuthUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      isAnonymous: false,
      emailVerified: false,
      photoURL: null,
    };

    it('should return null when not initialized', () => {
      const result = authCoreService.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return current user when initialized', async () => {
      mockProvider.getCurrentUser.mockReturnValue(mockUser);
      await authCoreService.initialize(mockProvider);

      const result = authCoreService.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no current user', async () => {
      mockProvider.getCurrentUser.mockReturnValue(null);
      await authCoreService.initialize(mockProvider);

      const result = authCoreService.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('onAuthStateChange', () => {
    it('should return cleanup function when not initialized', () => {
      const callback = jest.fn();
      const cleanup = authCoreService.onAuthStateChange(callback);
      
      expect(callback).toHaveBeenCalledWith(null);
      expect(typeof cleanup).toBe('function');
    });

    it('should subscribe to auth state changes when initialized', async () => {
      const callback = jest.fn();
      const mockCleanup = jest.fn();
      mockProvider.onAuthStateChange.mockReturnValue(mockCleanup);
      
      await authCoreService.initialize(mockProvider);
      const cleanup = authCoreService.onAuthStateChange(callback);

      expect(mockProvider.onAuthStateChange).toHaveBeenCalledWith(callback);
      expect(cleanup).toBe(mockCleanup);
    });
  });

  describe('getConfig', () => {
    it('should return the current config', () => {
      const config = authCoreService.getConfig();
      expect(config).toEqual(DEFAULT_AUTH_CONFIG);
    });
  });
});