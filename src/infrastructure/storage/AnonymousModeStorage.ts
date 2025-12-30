/**
 * Anonymous Mode Storage
 * Single Responsibility: Manage anonymous mode persistence
 */

import { getAuthPackage } from "../services/AuthPackage";

export async function loadAnonymousMode(storageKey?: string): Promise<boolean> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.anonymousMode ?? "@auth_anonymous_mode";

    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) return false;

    const value = await storageProvider.get(key);
    return value === "true";
  } catch {
    return false;
  }
}

export async function saveAnonymousMode(isAnonymous: boolean, storageKey?: string): Promise<void> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.anonymousMode ?? "@auth_anonymous_mode";

    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) return;

    if (isAnonymous) {
      await storageProvider.set(key, "true");
    } else {
      await storageProvider.remove(key);
    }
  } catch {
    // Ignore storage errors
  }
}

export async function clearAnonymousMode(storageKey?: string): Promise<void> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.anonymousMode ?? "@auth_anonymous_mode";

    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) return;

    await storageProvider.remove(key);
  } catch {
    // Ignore storage errors
  }
}
