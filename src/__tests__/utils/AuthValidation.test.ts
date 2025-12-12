/**
 * AuthValidation Tests
 */

import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
} from '../../../src/infrastructure/utils/AuthValidation';
import { DEFAULT_PASSWORD_CONFIG } from '../../../src/domain/value-objects/AuthConfig';
import { initializeAuthPackage } from '../../../src/infrastructure/services/AuthPackage';

describe('AuthValidation', () => {
  beforeEach(() => {
    // Reset package config before each test
    initializeAuthPackage();
  });

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
      expect(result.error).toBeUndefined();
    });

    it('should accept valid email with subdomain', () => {
      const result = validateEmail('test@mail.example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should trim whitespace', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validatePasswordForLogin', () => {
    it('should reject empty password', () => {
      const result = validatePasswordForLogin('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should accept any non-empty password', () => {
      const result = validatePasswordForLogin('any');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept password with spaces', () => {
      const result = validatePasswordForLogin('  password  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validatePasswordForRegister', () => {
    const config = DEFAULT_PASSWORD_CONFIG;

    it('should reject empty password', () => {
      const result = validatePasswordForRegister('', config);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
      expect(result.requirements.hasMinLength).toBe(false);
    });

    it('should reject password that is too short', () => {
      const result = validatePasswordForRegister('123', config);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Password must be at least ${config.minLength} characters`);
      expect(result.requirements.hasMinLength).toBe(false);
    });

    it('should accept password that meets minimum length', () => {
      const result = validatePasswordForRegister('12345678', config);
      expect(result.requirements.hasMinLength).toBe(true);
    });

    it('should validate uppercase requirement', () => {
      const configWithUppercase = {
        ...config,
        requireUppercase: true,
      };

      const result = validatePasswordForRegister('password', configWithUppercase);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one uppercase letter');
      expect(result.requirements.hasUppercase).toBe(false);

      const validResult = validatePasswordForRegister('Password', configWithUppercase);
      expect(validResult.requirements.hasUppercase).toBe(true);
    });

    it('should validate lowercase requirement', () => {
      const configWithLowercase = {
        ...config,
        requireLowercase: true,
      };

      const result = validatePasswordForRegister('PASSWORD', configWithLowercase);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one lowercase letter');
      expect(result.requirements.hasLowercase).toBe(false);

      const validResult = validatePasswordForRegister('Password', configWithLowercase);
      expect(validResult.requirements.hasLowercase).toBe(true);
    });

    it('should validate number requirement', () => {
      const configWithNumber = {
        ...config,
        requireNumber: true,
      };

      const result = validatePasswordForRegister('Password', configWithNumber);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one number');
      expect(result.requirements.hasNumber).toBe(false);

      const validResult = validatePasswordForRegister('Password1', configWithNumber);
      expect(validResult.requirements.hasNumber).toBe(true);
    });

    it('should validate special character requirement', () => {
      const configWithSpecial = {
        ...config,
        requireSpecialChar: true,
      };

      const result = validatePasswordForRegister('Password1', configWithSpecial);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one special character');
      expect(result.requirements.hasSpecialChar).toBe(false);

      const validResult = validatePasswordForRegister('Password1!', configWithSpecial);
      expect(validResult.requirements.hasSpecialChar).toBe(true);
    });

    it('should accept password that meets all requirements', () => {
      const strictConfig = {
        ...config,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecialChar: true,
      };

      const result = validatePasswordForRegister('Password1!', strictConfig);
      expect(result.isValid).toBe(true);
      expect(result.requirements).toEqual({
        hasMinLength: true,
        hasUppercase: true,
        hasLowercase: true,
        hasNumber: true,
        hasSpecialChar: true,
      });
    });

    it('should skip requirements when disabled', () => {
      const lenientConfig = {
        ...config,
        requireUppercase: false,
        requireLowercase: false,
        requireNumber: false,
        requireSpecialChar: false,
      };

      const result = validatePasswordForRegister('password', lenientConfig);
      expect(result.requirements).toEqual({
        hasMinLength: true,
        hasUppercase: true, // Should be true when requirement is disabled
        hasLowercase: true, // Should be true when requirement is disabled
        hasNumber: true, // Should be true when requirement is disabled
        hasSpecialChar: true, // Should be true when requirement is disabled
      });
    });
  });

  describe('validatePasswordConfirmation', () => {
    it('should reject empty confirmation', () => {
      const result = validatePasswordConfirmation('password', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should reject mismatched passwords', () => {
      const result = validatePasswordConfirmation('password', 'different');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should accept matching passwords', () => {
      const result = validatePasswordConfirmation('password', 'password');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle empty passwords that match', () => {
      const result = validatePasswordConfirmation('', '');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

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
      expect(result.error).toBeUndefined();
    });

    it('should use custom minimum length', () => {
      const result = validateDisplayName('Al', 3);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 3 characters');
    });

    it('should trim whitespace', () => {
      const result = validateDisplayName('  John Doe  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept name with special characters', () => {
      const result = validateDisplayName('John-O\'Connor');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});