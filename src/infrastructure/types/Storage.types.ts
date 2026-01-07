/**
 * Storage Provider Interface
 * Generic storage interface for auth operations
 */

export interface IStorageProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
