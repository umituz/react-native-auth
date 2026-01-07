/**
 * Anonymous Mode Service
 * Handles anonymous mode functionality
 */

import type { IAuthProvider } from "../../application/ports/IAuthProvider";
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
      return false;
    }
  }

  private async save(storageProvider: IStorageProvider): Promise<void> {
    try {
      await storageProvider.set(this.storageKey, this.isAnonymousMode.toString());
    } catch {
      // Silently fail storage operations
    }
  }

  async clear(storageProvider: IStorageProvider): Promise<void> {
    try {
      await storageProvider.remove(this.storageKey);
    } catch {
      // Silently fail storage operations
    }
    this.isAnonymousMode = false;
  }

  async enable(storageProvider: IStorageProvider, provider?: IAuthProvider): Promise<void> {
    // Sign out from provider if logged in
    if (provider?.getCurrentUser()) {
      try {
        await provider.signOut();
      } catch {
        // Ignore sign out errors when switching to anonymous mode
      }
    }

    this.isAnonymousMode = true;
    await this.save(storageProvider);
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
      // Don't update if in anonymous mode
      if (!this.isAnonymousMode) {
        callback(user);
      } else {
        callback(null);
      }
    };
  }
}