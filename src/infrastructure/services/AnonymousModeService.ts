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
    } catch (error) {
      if (__DEV__) {
        console.warn("[AnonymousModeService] Storage load failed:", error);
      }
      return false;
    }
  }

  private async save(storageProvider: IStorageProvider): Promise<void> {
    try {
      await storageProvider.set(this.storageKey, this.isAnonymousMode.toString());
    } catch (err) {
      if (__DEV__) {
        console.error("[AnonymousModeService] Storage save failed:", err);
      }
    }
  }

  async clear(storageProvider: IStorageProvider): Promise<void> {
    try {
      await storageProvider.remove(this.storageKey);
    } catch (err) {
      if (__DEV__) {
        console.error("[AnonymousModeService] Storage clear failed:", err);
      }
    }
    this.isAnonymousMode = false;
  }

  async enable(storageProvider: IStorageProvider, provider?: IAuthProvider): Promise<void> {
    // Sign out from provider if logged in
    if (provider?.getCurrentUser()) {
      try {
        await provider.signOut();
      } catch (error) {
        if (__DEV__) {
          console.warn("[AnonymousModeService] Sign out failed during mode switch:", error);
        }
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