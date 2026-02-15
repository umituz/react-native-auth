/**
 * Anonymous Mode Service
 * Handles anonymous mode functionality
 */

import type { AuthUser } from "../../domain/entities/AuthUser";
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

  private async save(storageProvider: IStorageProvider): Promise<boolean> {
    try {
      await storageProvider.set(this.storageKey, this.isAnonymousMode.toString());
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
    // Save to storage first, then update memory to maintain consistency
    const previousState = this.isAnonymousMode;
    this.isAnonymousMode = true;
    const saveSuccess = await this.save(storageProvider);

    if (!saveSuccess) {
      // Rollback on failure
      this.isAnonymousMode = previousState;
      throw new Error('Failed to save anonymous mode state');
    }

    emitAnonymousModeEnabled();
  }

  getIsAnonymousMode(): boolean {
    return this.isAnonymousMode;
  }

  setAnonymousMode(enabled: boolean): void {
    this.isAnonymousMode = enabled;
  }

  wrapAuthStateCallback(
    callback: (user: AuthUser | null) => void
  ): (user: AuthUser | null) => void {
    return (user: AuthUser | null) => {
      // In anonymous mode, still pass the actual Firebase user
      // The store will handle setting the isAnonymous flag appropriately
      // This allows proper anonymous to registered user conversion
      callback(user);
    };
  }
}