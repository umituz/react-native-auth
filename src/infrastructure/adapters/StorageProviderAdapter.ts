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
        // @umituz/react-native-storage format
        const result = await this.storage.getString(key, null);
        return result?.value ?? null;
      } else if (this.storage.getItem) {
        // AsyncStorage format
        return await this.storage.getItem(key);
      } else {
        throw new Error("Unsupported storage implementation");
      }
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      if (this.storage.setString) {
        // @umituz/react-native-storage format
        await this.storage.setString(key, value);
      } else if (this.storage.setItem) {
        // AsyncStorage format
        await this.storage.setItem(key, value);
      } else {
        throw new Error("Unsupported storage implementation");
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[StorageProviderAdapter] Failed to set value:", error);
      }
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (this.storage.removeItem) {
        // Both AsyncStorage and @umituz/react-native-storage support removeItem
        await this.storage.removeItem(key);
      } else {
        throw new Error("Unsupported storage implementation");
      }
    } catch (error) {
      if (__DEV__) {
        console.warn("[StorageProviderAdapter] Failed to remove value:", error);
      }
      throw error;
    }
  }
}

/**
 * Create storage provider from various storage implementations
 */
export function createStorageProvider(storage: any): IStorageProvider {
  return new StorageProviderAdapter(storage);
}