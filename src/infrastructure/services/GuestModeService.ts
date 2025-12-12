/**
 * Guest Mode Service
 * Handles guest mode functionality
 */

import type { IAuthProvider } from "../../application/ports/IAuthProvider";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { emitGuestModeEnabled } from "../utils/AuthEventEmitter";

export interface IStorageProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export class GuestModeService {
  private isGuestMode: boolean = false;
  private storageKey: string;

  constructor(storageKey: string = "@auth_guest_mode") {
    this.storageKey = storageKey;
  }

  async load(storageProvider: IStorageProvider): Promise<boolean> {
    try {
      const value = await storageProvider.get(this.storageKey);
      this.isGuestMode = value === "true";
      return this.isGuestMode;
    } catch {
      return false;
    }
  }

  async save(storageProvider: IStorageProvider): Promise<void> {
    try {
      await storageProvider.set(this.storageKey, this.isGuestMode.toString());
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
    this.isGuestMode = false;
  }

  async enable(storageProvider: IStorageProvider, provider?: IAuthProvider): Promise<void> {
    // Sign out from provider if logged in
    if (provider?.getCurrentUser()) {
      try {
        await provider.signOut();
      } catch {
        // Ignore sign out errors when switching to guest mode
      }
    }

    this.isGuestMode = true;
    await this.save(storageProvider);
    emitGuestModeEnabled();
  }

  getIsGuestMode(): boolean {
    return this.isGuestMode;
  }

  setGuestMode(enabled: boolean): void {
    this.isGuestMode = enabled;
  }

  wrapAuthStateCallback(
    callback: (user: AuthUser | null) => void
  ): (user: AuthUser | null) => void {
    return (user: AuthUser | null) => {
      // Don't update if in guest mode
      if (!this.isGuestMode) {
        callback(user);
      } else {
        callback(null);
      }
    };
  }
}