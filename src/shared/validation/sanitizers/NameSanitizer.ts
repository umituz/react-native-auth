/**
 * Name Sanitizer
 * Handles display name input sanitization
 */

export class NameSanitizer {
  /**
   * Sanitize name input
   * Trims whitespace and normalizes internal spaces
   */
  static sanitize(name: string | null | undefined): string {
    if (!name) return '';
    return name.trim().replace(/\s+/g, ' ');
  }

  /**
   * Check if name is empty
   */
  static isEmpty(name: string | null | undefined): boolean {
    return !name || name.trim() === '';
  }
}
