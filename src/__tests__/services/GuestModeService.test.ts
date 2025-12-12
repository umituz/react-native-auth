/**
 * GuestModeService Tests
 */

import { GuestModeService } from '../../../src/infrastructure/services/GuestModeService';
import type { IStorageProvider } from '../../../src/infrastructure/services/GuestModeService';

describe('GuestModeService', () => {
  let guestModeService: GuestModeService;
  let mockStorageProvider: jest.Mocked<IStorageProvider>;

  beforeEach(() => {
    mockStorageProvider = {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    };

    guestModeService = new GuestModeService('@test_guest_mode');
  });

  describe('constructor', () => {
    it('should use default storage key when none provided', () => {
      const service = new GuestModeService();
      expect(service.getIsGuestMode()).toBe(false);
    });

    it('should use custom storage key when provided', () => {
      const service = new GuestModeService('@custom_key');
      expect(service.getIsGuestMode()).toBe(false);
    });
  });

  describe('load', () => {
    it('should load false when storage returns null', async () => {
      mockStorageProvider.get.mockResolvedValue(null);
      
      const result = await guestModeService.load(mockStorageProvider);
      
      expect(result).toBe(false);
      expect(mockStorageProvider.get).toHaveBeenCalledWith('@test_guest_mode');
    });

    it('should load false when storage returns "false"', async () => {
      mockStorageProvider.get.mockResolvedValue('false');
      
      const result = await guestModeService.load(mockStorageProvider);
      
      expect(result).toBe(false);
    });

    it('should load true when storage returns "true"', async () => {
      mockStorageProvider.get.mockResolvedValue('true');
      
      const result = await guestModeService.load(mockStorageProvider);
      
      expect(result).toBe(true);
      expect(guestModeService.getIsGuestMode()).toBe(true);
    });

    it('should handle storage errors gracefully', async () => {
      mockStorageProvider.get.mockRejectedValue(new Error('Storage error'));
      
      const result = await guestModeService.load(mockStorageProvider);
      
      expect(result).toBe(false);
    });
  });

  describe('save', () => {
    it('should save true to storage when guest mode is enabled', async () => {
      guestModeService.setGuestMode(true);
      
      await guestModeService.save(mockStorageProvider);
      
      expect(mockStorageProvider.set).toHaveBeenCalledWith('@test_guest_mode', 'true');
    });

    it('should remove from storage when guest mode is disabled', async () => {
      guestModeService.setGuestMode(false);
      
      await guestModeService.save(mockStorageProvider);
      
      expect(mockStorageProvider.remove).toHaveBeenCalledWith('@test_guest_mode');
    });

    it('should handle storage errors gracefully', async () => {
      guestModeService.setGuestMode(true);
      mockStorageProvider.set.mockRejectedValue(new Error('Storage error'));
      
      await expect(guestModeService.save(mockStorageProvider)).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear guest mode and remove from storage', async () => {
      guestModeService.setGuestMode(true);
      
      await guestModeService.clear(mockStorageProvider);
      
      expect(guestModeService.getIsGuestMode()).toBe(false);
      expect(mockStorageProvider.remove).toHaveBeenCalledWith('@test_guest_mode');
    });

    it('should handle storage errors gracefully', async () => {
      mockStorageProvider.remove.mockRejectedValue(new Error('Storage error'));
      
      await expect(guestModeService.clear(mockStorageProvider)).resolves.not.toThrow();
      expect(guestModeService.getIsGuestMode()).toBe(false);
    });
  });

  describe('enable', () => {
    let mockAuthProvider: any;

    beforeEach(() => {
      mockAuthProvider = {
        getCurrentUser: jest.fn(),
        signOut: jest.fn(),
      };
    });

    it('should enable guest mode without provider', async () => {
      await guestModeService.enable(mockStorageProvider);
      
      expect(guestModeService.getIsGuestMode()).toBe(true);
      expect(mockStorageProvider.set).toHaveBeenCalledWith('@test_guest_mode', 'true');
    });

    it('should sign out provider if user is logged in', async () => {
      mockAuthProvider.getCurrentUser.mockReturnValue({ uid: 'test-user' });
      mockAuthProvider.signOut.mockResolvedValue(undefined);
      
      await guestModeService.enable(mockStorageProvider, mockAuthProvider);
      
      expect(mockAuthProvider.signOut).toHaveBeenCalled();
      expect(guestModeService.getIsGuestMode()).toBe(true);
    });

    it('should ignore sign out errors', async () => {
      mockAuthProvider.getCurrentUser.mockReturnValue({ uid: 'test-user' });
      mockAuthProvider.signOut.mockRejectedValue(new Error('Sign out error'));
      
      await expect(guestModeService.enable(mockStorageProvider, mockAuthProvider)).resolves.not.toThrow();
      expect(guestModeService.getIsGuestMode()).toBe(true);
    });
  });

  describe('wrapAuthStateCallback', () => {
    it('should call callback with user when not in guest mode', () => {
      const callback = jest.fn();
      const wrappedCallback = guestModeService.wrapAuthStateCallback(callback);
      const mockUser = { uid: 'test-user' };
      
      wrappedCallback(mockUser);
      
      expect(callback).toHaveBeenCalledWith(mockUser);
    });

    it('should call callback with null when in guest mode', () => {
      guestModeService.setGuestMode(true);
      const callback = jest.fn();
      const wrappedCallback = guestModeService.wrapAuthStateCallback(callback);
      const mockUser = { uid: 'test-user' };
      
      wrappedCallback(mockUser);
      
      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should call callback with null when user is null', () => {
      const callback = jest.fn();
      const wrappedCallback = guestModeService.wrapAuthStateCallback(callback);
      
      wrappedCallback(null);
      
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('getIsGuestMode and setGuestMode', () => {
    it('should return initial guest mode state', () => {
      expect(guestModeService.getIsGuestMode()).toBe(false);
    });

    it('should set and get guest mode state', () => {
      guestModeService.setGuestMode(true);
      expect(guestModeService.getIsGuestMode()).toBe(true);
      
      guestModeService.setGuestMode(false);
      expect(guestModeService.getIsGuestMode()).toBe(false);
    });
  });
});