/**
 * Password Sanitizer
 * Handles password input sanitization
 * IMPORTANT: Never trim passwords - whitespace may be intentional
 */

export class PasswordSanitizer {
  /**
   * Sanitize password input
   * NOTE: Does NOT trim - whitespace may be intentional
   */
  static sanitize(password: string | null | undefined): string {
    if (!password) return '';
    return password; // Don't trim passwords
  }

  /**
   * Check if password is empty
   * NOTE: Does NOT trim - checks actual length
   */
  static isEmpty(password: string | null | undefined): boolean {
    return !password || password.length === 0;
  }
}
