/**
 * AnonymousModeService Tests
 */

import { AnonymousModeService } from '../../infrastructure/services/AnonymousModeService';
import type { IStorageProvider } from '../../infrastructure/services/AuthPackage';

describe('AnonymousModeService', () => {
  let anonymousModeService: AnonymousModeService;
  let mockStorageProvider: jest.Mocked<IStorageProvider>;

  beforeEach(() => {
    mockStorageProvider = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    };

    anonymousModeService = new AnonymousModeService('@test_anonymous_mode');
  });

  describe('constructor', () => {
    it('should use default storage key when none provided', () => {
      const service = new AnonymousModeService();
      expect(service.getIsAnonymousMode()).toBe(false);
    });

    it('should use custom storage key when provided', () => {
      const service = new AnonymousModeService('@custom_key');
      expect(service.getIsAnonymousMode()).toBe(false);
    });
  });

  describe('load', () => {
    it('should load false when storage returns null', async () => {
      mockStorageProvider.get.mockResolvedValue(null);

      const result = await anonymousModeService.load(mockStorageProvider);

      expect(result).toBe(false);
      expect(mockStorageProvider.get).toHaveBeenCalledWith('@test_anonymous_mode');
    });

    it('should load false when storage returns "false"', async () => {
      mockStorageProvider.get.mockResolvedValue('false');

      const result = await anonymousModeService.load(mockStorageProvider);

      expect(result).toBe(false);
    });

    it('should load true when storage returns "true"', async () => {
      mockStorageProvider.get.mockResolvedValue('true');

      const result = await anonymousModeService.load(mockStorageProvider);

      expect(result).toBe(true);
      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);
    });

    it('should handle storage errors gracefully', async () => {
      mockStorageProvider.get.mockRejectedValue(new Error('Storage error'));

      const result = await anonymousModeService.load(mockStorageProvider);

      expect(result).toBe(false);
    });
  });

  describe('save', () => {
    it('should save true to storage when anonymous mode is enabled', async () => {
      anonymousModeService.setAnonymousMode(true);

      await anonymousModeService.save(mockStorageProvider);

      expect(mockStorageProvider.set).toHaveBeenCalledWith('@test_anonymous_mode', 'true');
    });

    it('should save false to storage when anonymous mode is disabled', async () => {
      anonymousModeService.setAnonymousMode(false);

      await anonymousModeService.save(mockStorageProvider);

      expect(mockStorageProvider.set).toHaveBeenCalledWith('@test_anonymous_mode', 'false');
    });

    it('should handle storage errors gracefully', async () => {
      anonymousModeService.setAnonymousMode(true);
      mockStorageProvider.set.mockRejectedValue(new Error('Storage error'));

      await expect(anonymousModeService.save(mockStorageProvider)).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear anonymous mode and remove from storage', async () => {
      anonymousModeService.setAnonymousMode(true);

      await anonymousModeService.clear(mockStorageProvider);

      expect(anonymousModeService.getIsAnonymousMode()).toBe(false);
      expect(mockStorageProvider.remove).toHaveBeenCalledWith('@test_anonymous_mode');
    });

    it('should handle storage errors gracefully', async () => {
      mockStorageProvider.remove.mockRejectedValue(new Error('Storage error'));

      await expect(anonymousModeService.clear(mockStorageProvider)).resolves.not.toThrow();
      expect(anonymousModeService.getIsAnonymousMode()).toBe(false);
    });
  });

  describe('enable', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockAuthProvider: any;

    beforeEach(() => {
      mockAuthProvider = {
        getCurrentUser: jest.fn(),
        signOut: jest.fn(),
      };
    });

    it('should enable anonymous mode without provider', async () => {
      await anonymousModeService.enable(mockStorageProvider);

      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);
      expect(mockStorageProvider.set).toHaveBeenCalledWith('@test_anonymous_mode', 'true');
    });

    it('should sign out provider if user is logged in', async () => {
      mockAuthProvider.getCurrentUser.mockReturnValue({ uid: 'test-user' });
      mockAuthProvider.signOut.mockResolvedValue(undefined);

      await anonymousModeService.enable(mockStorageProvider, mockAuthProvider);

      expect(mockAuthProvider.signOut).toHaveBeenCalled();
      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);
    });

    it('should ignore sign out errors', async () => {
      mockAuthProvider.getCurrentUser.mockReturnValue({ uid: 'test-user' });
      mockAuthProvider.signOut.mockRejectedValue(new Error('Sign out error'));

      await expect(anonymousModeService.enable(mockStorageProvider, mockAuthProvider)).resolves.not.toThrow();
      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);
    });
  });

  describe('wrapAuthStateCallback', () => {
    it('should call callback with user when not in anonymous mode', () => {
      const callback = jest.fn();
      const wrappedCallback = anonymousModeService.wrapAuthStateCallback(callback);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockUser = { uid: 'test-user' } as any;

      wrappedCallback(mockUser);

      expect(callback).toHaveBeenCalledWith(mockUser);
    });

    it('should call callback with null when in anonymous mode', () => {
      anonymousModeService.setAnonymousMode(true);
      const callback = jest.fn();
      const wrappedCallback = anonymousModeService.wrapAuthStateCallback(callback);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockUser = { uid: 'test-user' } as any;

      wrappedCallback(mockUser);

      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should call callback with null when user is null', () => {
      const callback = jest.fn();
      const wrappedCallback = anonymousModeService.wrapAuthStateCallback(callback);

      wrappedCallback(null);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('getIsAnonymousMode and setAnonymousMode', () => {
    it('should return initial anonymous mode state', () => {
      expect(anonymousModeService.getIsAnonymousMode()).toBe(false);
    });

    it('should set and get anonymous mode state', () => {
      anonymousModeService.setAnonymousMode(true);
      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);

      anonymousModeService.setAnonymousMode(false);
      expect(anonymousModeService.getIsAnonymousMode()).toBe(false);
    });
  });
});
