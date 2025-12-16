/**
 * Guest Mode Storage
 * Single Responsibility: Manage guest mode persistence
 */

import { getAuthPackage } from "../services/AuthPackage";

export async function loadGuestMode(storageKey?: string): Promise<boolean> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.guestMode ?? "@auth_guest_mode";

    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) return false;

    const value = await storageProvider.get(key);
    return value === "true";
  } catch {
    return false;
  }
}

export async function saveGuestMode(isGuest: boolean, storageKey?: string): Promise<void> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.guestMode ?? "@auth_guest_mode";

    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) return;

    if (isGuest) {
      await storageProvider.set(key, "true");
    } else {
      await storageProvider.remove(key);
    }
  } catch {
    // Ignore storage errors
  }
}

export async function clearGuestMode(storageKey?: string): Promise<void> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.guestMode ?? "@auth_guest_mode";

    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) return;

    await storageProvider.remove(key);
  } catch {
    // Ignore storage errors
  }
}
