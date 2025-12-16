/**
 * Storage Provider Adapter
 * Adapts external storage implementations to our IStorageProvider interface
 */

import type { IStorageProvider } from "../services/GuestModeService";

export class StorageProviderAdapter implements IStorageProvider {
  private storage: any;

  constructor(storage: any) {
    this.storage = storage;
  }

  async get(key: string): Promise<string | null> {
    try {
      if (this.storage.getString) {
        const result = await this.storage.getString(key, null);
        return result?.value ?? null;
      } else if (this.storage.getItem) {
        return await this.storage.getItem(key);
      } else {
        throw new Error("Unsupported storage implementation");
      }
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    if (this.storage.setString) {
      await this.storage.setString(key, value);
    } else if (this.storage.setItem) {
      await this.storage.setItem(key, value);
    } else {
      throw new Error("Unsupported storage implementation");
    }
  }

  async remove(key: string): Promise<void> {
    if (this.storage.removeItem) {
      await this.storage.removeItem(key);
    } else {
      throw new Error("Unsupported storage implementation");
    }
  }
}

export function createStorageProvider(storage: any): IStorageProvider {
  return new StorageProviderAdapter(storage);
}
