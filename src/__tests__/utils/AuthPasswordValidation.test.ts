import {
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from '../../../src/infrastructure/utils/AuthValidation';
import { DEFAULT_PASSWORD_CONFIG } from '../../../src/domain/value-objects/AuthConfig';

describe('AuthPasswordValidation', () => {
  describe('validatePasswordForLogin', () => {
    it('should reject empty password', () => {
      const result = validatePasswordForLogin('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should accept any non-empty password', () => {
      const result = validatePasswordForLogin('any');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePasswordForRegister', () => {
    const config = DEFAULT_PASSWORD_CONFIG;

    it('should reject empty password', () => {
      const result = validatePasswordForRegister('', config);
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasMinLength).toBe(false);
    });

    it('should reject password that is too short', () => {
      const result = validatePasswordForRegister('123', config);
      expect(result.isValid).toBe(false);
      expect(result.requirements.hasMinLength).toBe(false);
    });

    it('should validate uppercase requirement', () => {
      const configReq = { ...config, requireUppercase: true };
      expect(validatePasswordForRegister('password', configReq).isValid).toBe(false);
      expect(validatePasswordForRegister('Password', configReq).requirements.hasUppercase).toBe(true);
    });

    it('should validate lowercase requirement', () => {
      const configReq = { ...config, requireLowercase: true };
      expect(validatePasswordForRegister('PASSWORD', configReq).isValid).toBe(false);
      expect(validatePasswordForRegister('Password', configReq).requirements.hasLowercase).toBe(true);
    });

    it('should validate number requirement', () => {
      const configReq = { ...config, requireNumber: true };
      expect(validatePasswordForRegister('Password', configReq).isValid).toBe(false);
      expect(validatePasswordForRegister('Password1', configReq).requirements.hasNumber).toBe(true);
    });

    it('should validate special character requirement', () => {
      const configReq = { ...config, requireSpecialChar: true };
      expect(validatePasswordForRegister('Password1', configReq).isValid).toBe(false);
      expect(validatePasswordForRegister('Password1!', configReq).requirements.hasSpecialChar).toBe(true);
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
    });
  });

  describe('validatePasswordConfirmation', () => {
    it('should reject empty confirmation', () => {
      const result = validatePasswordConfirmation('password', '');
      expect(result.isValid).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = validatePasswordConfirmation('password', 'different');
      expect(result.isValid).toBe(false);
    });

    it('should accept matching passwords', () => {
      const result = validatePasswordConfirmation('password', 'password');
      expect(result.isValid).toBe(true);
    });
  });
});