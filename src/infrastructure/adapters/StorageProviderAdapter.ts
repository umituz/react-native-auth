/**
 * Storage Provider Adapter
 * Adapts external storage implementations to our IStorageProvider interface
 */

import type { IStorageProvider } from "../services/AuthPackage";

/**
 * Interface that describes the shape of common storage implementations
 * to avoid using 'any' and resolve lint errors.
 */
interface StorageLike {
  getString?: (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValue?: any
  ) => Promise<{ value: string | null } | null>;
  getItem?: (key: string) => Promise<string | null>;
  setString?: (key: string, value: string) => Promise<void>;
  setItem?: (key: string, value: string) => Promise<void>;
  removeItem?: (key: string) => Promise<void>;
}

export class StorageProviderAdapter implements IStorageProvider {
  private storage: StorageLike;

  constructor(storage: unknown) {
    this.storage = storage as StorageLike;
  }

  async get(key: string): Promise<string | null> {
    try {
      if (typeof this.storage.getString === "function") {
        const result = await this.storage.getString(key, null);
        return result?.value ?? null;
      } else if (typeof this.storage.getItem === "function") {
        return await this.storage.getItem(key);
      } else {
        throw new Error("Unsupported storage implementation");
      }
    } catch {
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

export function createStorageProvider(storage: unknown): IStorageProvider {
  return new StorageProviderAdapter(storage);
}
