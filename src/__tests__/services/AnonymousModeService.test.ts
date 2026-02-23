import { AnonymousModeService } from '../../infrastructure/services/AnonymousModeService';
import type { IStorageProvider } from '../../infrastructure/services/AuthPackage';

describe('AnonymousModeService', () => {
  let anonymousModeService: AnonymousModeService;
  let mockStorageProvider: jest.Mocked<IStorageProvider>;

  beforeEach(() => {
    mockStorageProvider = { get: jest.fn(), set: jest.fn(), remove: jest.fn() };
    anonymousModeService = new AnonymousModeService('@test_anonymous_mode');
  });

  describe('configuration', () => {
    it('should use storage keys correctly', () => {
      const service = new AnonymousModeService('@custom');
      expect(service.getIsAnonymousMode()).toBe(false);
    });
  });

  describe('persistence', () => {
    it('should load state from storage', async () => {
      mockStorageProvider.get.mockResolvedValue('true');
      const result = await anonymousModeService.load(mockStorageProvider);
      expect(result).toBe(true);
      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);
    });

    it('should handle missing storage state', async () => {
      mockStorageProvider.get.mockResolvedValue(null);
      expect(await anonymousModeService.load(mockStorageProvider)).toBe(false);
    });

    it('should save state to storage', async () => {
      anonymousModeService.setAnonymousMode(true);
      await anonymousModeService.save(mockStorageProvider);
      expect(mockStorageProvider.set).toHaveBeenCalledWith('@test_anonymous_mode', 'true');
    });

    it('should clear state from storage', async () => {
      await anonymousModeService.clear(mockStorageProvider);
      expect(anonymousModeService.getIsAnonymousMode()).toBe(false);
      expect(mockStorageProvider.remove).toHaveBeenCalledWith('@test_anonymous_mode');
    });
  });

  describe('auth integration', () => {
    it('should enable anonymous mode', async () => {
      mockStorageProvider.set.mockResolvedValue(undefined);
      await anonymousModeService.enable(mockStorageProvider);
      expect(anonymousModeService.getIsAnonymousMode()).toBe(true);
    });
  });
});
