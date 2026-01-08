/**
 * Sanitization Utilities
 * Secure input cleaning for user data
 */

/**
 * Security constants for input validation
 */
export const SECURITY_LIMITS = {
  EMAIL_MAX_LENGTH: 254, // RFC 5321
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  GENERAL_TEXT_MAX_LENGTH: 500,
} as const;

/**
 * Trim and normalize whitespace
 */
export const sanitizeWhitespace = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitize email address
 * - Trim whitespace
 * - Convert to lowercase
 * - Limit length
 */
export const sanitizeEmail = (email: string): string => {
  const trimmed = email.trim().toLowerCase();
  return trimmed.substring(0, SECURITY_LIMITS.EMAIL_MAX_LENGTH);
};

/**
 * Sanitize password
 * - Only trim (preserve case and special chars)
 * - Limit length to prevent DoS
 */
export const sanitizePassword = (password: string): string => {
  // Don't trim password to preserve intentional spaces
  // Only limit length
  return password.substring(0, SECURITY_LIMITS.PASSWORD_MAX_LENGTH);
};

/**
 * Sanitize display name
 * - Trim whitespace
 * - Normalize multiple spaces
 * - Remove potential XSS characters
 * - Limit length
 */
export const sanitizeName = (name: string): string => {
  const trimmed = sanitizeWhitespace(name);
  // Remove HTML tags and script content
  const noTags = trimmed.replace(/<[^>]*>/g, '');
  return noTags.substring(0, SECURITY_LIMITS.NAME_MAX_LENGTH);
};

/**
 * Sanitize general text input
 * - Trim whitespace
 * - Remove HTML/script tags
 * - Limit length
 */
export const sanitizeText = (text: string): string => {
  const trimmed = sanitizeWhitespace(text);
  const noTags = trimmed.replace(/<[^>]*>/g, '');
  return noTags.substring(0, SECURITY_LIMITS.GENERAL_TEXT_MAX_LENGTH);
};

/**
 * Check if string contains potentially dangerous characters
 */
export const containsDangerousChars = (input: string): boolean => {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onload, etc.
    /<iframe/i,
    /eval\(/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate string length is within bounds
 */
export const isWithinLengthLimit = (
  input: string,
  maxLength: number,
  minLength = 0
): boolean => {
  const length = input.trim().length;
  return length >= minLength && length <= maxLength;
};
