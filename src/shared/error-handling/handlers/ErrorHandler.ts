/**
 * Error Handler
 * Centralized error handling logic
 */

import type { ErrorMap } from '../types/ErrorTypes';
import { ErrorMapper, DEFAULT_AUTH_ERROR_MAPPINGS } from '../mappers/ErrorMapper';

export class ErrorHandler {
  private mapper: ErrorMapper;
  private translations?: ErrorMap;

  constructor(translations?: ErrorMap, config?: typeof DEFAULT_AUTH_ERROR_MAPPINGS) {
    this.mapper = new ErrorMapper(config || DEFAULT_AUTH_ERROR_MAPPINGS);
    this.translations = translations;
  }

  /**
   * Handle error and return user-friendly message
   */
  handle(error: unknown): string {
    const key = this.mapper.getLocalizationKey(error);
    return this.mapper.resolveMessage(key, this.translations);
  }

  /**
   * Get localization key for error
   */
  getErrorKey(error: unknown): string {
    return this.mapper.getLocalizationKey(error);
  }

  /**
   * Update translations
   */
  setTranslations(translations: ErrorMap): void {
    this.translations = translations;
  }

  /**
   * Set error mappings
   */
  setMappings(config: Partial<typeof DEFAULT_AUTH_ERROR_MAPPINGS>): void {
    this.mapper.setMappings(config);
  }

  /**
   * Check if error is of specific type
   */
  isErrorType(error: unknown, errorName: string): boolean {
    return error instanceof Error && error.name === errorName;
  }

  /**
   * Log error in development
   */
  logError(context: string, error: unknown): void {
    if (__DEV__) {
      console.error(`[${context}] Error:`, error);
    }
  }

  /**
   * Handle and log error
   */
  handleAndLog(context: string, error: unknown): string {
    this.logError(context, error);
    return this.handle(error);
  }
}
