import { validateEmail } from '../../../src/infrastructure/utils/AuthValidation';

describe('AuthEmailValidation', () => {
  describe('validateEmail', () => {
    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject whitespace-only email', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should accept valid email format', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should accept valid email with subdomain', () => {
      const result = validateEmail('test@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    it('should trim whitespace', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.isValid).toBe(true);
    });
  });
});