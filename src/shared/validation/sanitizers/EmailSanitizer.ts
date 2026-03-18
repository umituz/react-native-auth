/**
 * Email Sanitizer
 * Handles email input sanitization
 */

export class EmailSanitizer {
  /**
   * Sanitize email input
   * Trims whitespace and converts to lowercase
   */
  static sanitize(email: string | null | undefined): string {
    if (!email) return '';
    return email.trim().toLowerCase();
  }

  /**
   * Check if email is empty
   */
  static isEmpty(email: string | null | undefined): boolean {
    return !email || email.trim() === '';
  }
}
