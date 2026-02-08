/**
 * Sanitization Utilities
 * Secure input cleaning for user data
 *
 * @module Sanitization
 * @description Provides input sanitization functions to prevent XSS attacks,
 * injection attacks, and ensure data integrity. All user inputs should be
 * sanitized before storage or processing.
 *
 * Security Limits:
 * These constants define maximum lengths for various input fields to prevent
 * DoS attacks and ensure database integrity. They are based on industry standards:
 *
 * - EMAIL_MAX_LENGTH: 254 (RFC 5321 - maximum email address length)
 * - PASSWORD_MAX_LENGTH: 128 (NIST recommendations)
 * - NAME_MAX_LENGTH: 100 (Reasonable limit for display names)
 * - GENERAL_TEXT_MAX_LENGTH: 500 (Prevents abuse of text fields)
 *
 * @note These limits are currently hardcoded for security. If you need to
 * customize them for your application, you can:
 * 1. Create your own sanitization functions with custom limits
 * 2. Use the helper functions like `isWithinLengthLimit()` for validation
 * 3. Submit a PR to make these limits configurable via AuthConfig
 */

/**
 * Security constants for input validation
 *
 * @constant
 * @type {readonly [key: string]: number}
 *
 * @property {number} EMAIL_MAX_LENGTH - Maximum email length per RFC 5321
 * @property {number} PASSWORD_MIN_LENGTH - Minimum password length (configurable via AuthConfig)
 * @property {number} PASSWORD_MAX_LENGTH - Maximum password length to prevent DoS
 * @property {number} NAME_MAX_LENGTH - Maximum display name length
 * @property {number} GENERAL_TEXT_MAX_LENGTH - Maximum general text input length
 */
export const SECURITY_LIMITS = {
  EMAIL_MAX_LENGTH: 254, // RFC 5321
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MAX_LENGTH: 100,
  GENERAL_TEXT_MAX_LENGTH: 500,
} as const;

/**
 * Type for security limit keys
 */
export type SecurityLimitKey = keyof typeof SECURITY_LIMITS;

/**
 * Get a specific security limit value
 * @param key - The security limit key
 * @returns The security limit value
 * @example
 * ```ts
 * const maxEmailLength = getSecurityLimit('EMAIL_MAX_LENGTH'); // 254
 * ```
 */
export function getSecurityLimit(key: SecurityLimitKey): number {
  return SECURITY_LIMITS[key];
}

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
 * - Trim leading/trailing whitespace to prevent login issues
 * - Preserve case and special chars
 * - Limit length to prevent DoS
 */
export const sanitizePassword = (password: string): string => {
  // Trim leading/trailing spaces to prevent authentication issues
  // Internal spaces are preserved for special use cases
  return password.trim().substring(0, SECURITY_LIMITS.PASSWORD_MAX_LENGTH);
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
