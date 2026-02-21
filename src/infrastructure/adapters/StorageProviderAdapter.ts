/**
 * Storage Provider Adapter
 * Adapts external storage implementations to our IStorageProvider interface
 */

import type { IStorageProvider } from "../types/Storage.types";

declare const __DEV__: boolean;

/**
 * Interface that describes the shape of common storage implementations
 * to avoid using 'any' and resolve lint errors.
 */
interface StorageLike {
  getString?: (
    key: string,
    defaultValue?: string | null
  ) => Promise<{ value?: string | null; data?: string | null; success?: boolean } | null>;
  getItem?: (key: string, defaultValue?: unknown) => Promise<string | { data?: unknown; success?: boolean } | null>;
  setString?: (key: string, value: string) => Promise<unknown>;
  setItem?: (key: string, value: unknown) => Promise<unknown>;
  removeItem?: (key: string) => Promise<unknown>;
}

export class StorageProviderAdapter implements IStorageProvider {
  private storage: StorageLike;

  constructor(storage: StorageLike) {
    this.storage = storage;
  }

  async get(key: string): Promise<string | null> {
    try {
      if (typeof this.storage.getString === "function") {
        const result = await this.storage.getString(key, null);
        if (!result) return null;
        return result.value ?? result.data ?? null;
      } else if (typeof this.storage.getItem === "function") {
        const result = await this.storage.getItem(key);
        if (!result) return null;
        if (typeof result === "string") return result;
        if (result.data != null) return String(result.data);
        return null;
      } else {
        throw new Error("Unsupported storage implementation");
      }
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.warn("[StorageProviderAdapter] get failed for key:", key, error);
      }
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    if (typeof this.storage.setString === "function") {
      await this.storage.setString(key, value);
    } else if (typeof this.storage.setItem === "function") {
      await this.storage.setItem(key, value);
    } else {
      throw new Error("Unsupported storage implementation");
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof this.storage.removeItem === "function") {
      await this.storage.removeItem(key);
    } else {
      throw new Error("Unsupported storage implementation");
    }
  }
}

export function createStorageProvider(storage: StorageLike): IStorageProvider {
  return new StorageProviderAdapter(storage);
}
