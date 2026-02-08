/**
 * Sanitization Utilities
 * Secure input cleaning for user data
 */

export const SECURITY_LIMITS = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  GENERAL_TEXT_MAX_LENGTH: 500,
} as const;

export type SecurityLimitKey = keyof typeof SECURITY_LIMITS;

export const sanitizeWhitespace = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email: string): string => {
  const trimmed = email.trim().toLowerCase();
  return trimmed.substring(0, SECURITY_LIMITS.EMAIL_MAX_LENGTH);
};

export const sanitizePassword = (password: string): string => {
  return password.trim().substring(0, SECURITY_LIMITS.PASSWORD_MAX_LENGTH);
};

export const sanitizeName = (name: string): string => {
  const trimmed = sanitizeWhitespace(name);
  const noTags = trimmed.replace(/<[^>]*>/g, '');
  return noTags.substring(0, SECURITY_LIMITS.NAME_MAX_LENGTH);
};

export const sanitizeText = (text: string): string => {
  const trimmed = sanitizeWhitespace(text);
  const noTags = trimmed.replace(/<[^>]*>/g, '');
  return noTags.substring(0, SECURITY_LIMITS.GENERAL_TEXT_MAX_LENGTH);
};

export const containsDangerousChars = (input: string): boolean => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\(/i,
  ];
  return dangerousPatterns.some(pattern => pattern.test(input));
};

export const isWithinLengthLimit = (
  input: string,
  maxLength: number,
  minLength = 0
): boolean => {
  const length = input.trim().length;
  return length >= minLength && length <= maxLength;
};
