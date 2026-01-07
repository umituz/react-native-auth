import { validateDisplayName } from '../../../src/infrastructure/utils/AuthValidation';

describe('AuthDisplayNameValidation', () => {
  describe('validateDisplayName', () => {
    it('should reject empty name', () => {
      const result = validateDisplayName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should reject whitespace-only name', () => {
      const result = validateDisplayName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should reject name that is too short', () => {
      const result = validateDisplayName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should accept name that meets minimum length', () => {
      const result = validateDisplayName('Al');
      expect(result.isValid).toBe(true);
    });

    it('should use custom minimum length', () => {
      const result = validateDisplayName('Al', 3);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 3 characters');
    });

    it('should trim whitespace', () => {
      const result = validateDisplayName('  John Doe  ');
      expect(result.isValid).toBe(true);
    });

    it('should accept name with special characters', () => {
      const result = validateDisplayName('John-O\'Connor');
      expect(result.isValid).toBe(true);
    });
  });
});