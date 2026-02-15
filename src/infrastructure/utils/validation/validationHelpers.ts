/**
 * Validation Helpers
 * Standardized helper functions for common validation checks
 */

/**
 * Check if a string is empty or null/undefined
 * Handles null/undefined gracefully
 *
 * @param value - String to check
 * @returns true if empty, null, or undefined
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim() === '';
}

/**
 * Check if an email is empty or null/undefined
 * Email-specific validation that checks for empty after trimming
 *
 * @param email - Email to check
 * @returns true if empty, null, or undefined
 */
export function isEmptyEmail(email: string | null | undefined): boolean {
  return !email || email.trim() === '';
}

/**
 * Check if a password is empty or null/undefined
 * Password-specific validation - does NOT trim (whitespace may be intentional)
 *
 * @param password - Password to check
 * @returns true if empty, null, or undefined
 */
export function isEmptyPassword(password: string | null | undefined): boolean {
  return !password || password.length === 0;
}

/**
 * Check if a name is empty or null/undefined
 * Name-specific validation that checks for empty after trimming
 *
 * @param name - Name to check
 * @returns true if empty, null, or undefined
 */
export function isEmptyName(name: string | null | undefined): boolean {
  return !name || name.trim() === '';
}

/**
 * Check if a value is not empty
 * Convenience function - inverse of isEmpty
 *
 * @param value - String to check
 * @returns true if not empty
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return !isEmpty(value);
}

/**
 * Check if a value has content (not empty and has non-whitespace characters)
 * Stricter than isNotEmpty - ensures actual content exists
 *
 * @param value - String to check
 * @returns true if has actual content
 */
export function hasContent(value: string | null | undefined): boolean {
  return !!value && value.trim().length > 0;
}
