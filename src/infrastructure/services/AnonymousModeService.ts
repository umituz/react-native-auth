/**
 * Anonymous Mode Service
 * Handles anonymous mode functionality
 */

import { emitAnonymousModeEnabled } from "./AuthEventService";
import type { IStorageProvider } from "../types/Storage.types";

export class AnonymousModeService {
  private isAnonymousMode: boolean = false;
  private storageKey: string;

  constructor(storageKey: string = "@auth_anonymous_mode") {
    this.storageKey = storageKey;
  }

  async load(storageProvider: IStorageProvider): Promise<boolean> {
    try {
      const value = await storageProvider.get(this.storageKey);
      this.isAnonymousMode = value === "true";
      return this.isAnonymousMode;
    } catch {
      // On error, reset to false to maintain consistency
      this.isAnonymousMode = false;
      return false;
    }
  }

  private async save(storageProvider: IStorageProvider, value: boolean): Promise<boolean> {
    try {
      await storageProvider.set(this.storageKey, value.toString());
      return true;
    } catch {
      return false;
    }
  }

  async clear(storageProvider: IStorageProvider): Promise<boolean> {
    try {
      await storageProvider.remove(this.storageKey);
      this.isAnonymousMode = false;
      return true;
    } catch {
      // Don't update memory state if storage operation failed
      // This maintains consistency between storage and memory
      return false;
    }
  }

  async enable(storageProvider: IStorageProvider): Promise<void> {
    // Save to storage first, then update memory to maintain consistency.
    // This prevents TOCTOU: memory is never set to true unless storage confirms the write.
    const saveSuccess = await this.save(storageProvider, true);

    if (!saveSuccess) {
      throw new Error('Failed to save anonymous mode state');
    }

    this.isAnonymousMode = true;
    emitAnonymousModeEnabled();
  }

  getIsAnonymousMode(): boolean {
    return this.isAnonymousMode;
  }

  setAnonymousMode(enabled: boolean): void {
    this.isAnonymousMode = enabled;
  }

}