/**
 * Guest Mode Storage
 * Single Responsibility: Manage guest mode persistence
 */

import type { IStorageProvider } from "../services/GuestModeService";
import { getAuthPackage } from "../services/AuthPackage";

/**
 * Load guest mode from storage
 */
export async function loadGuestMode(storageKey?: string): Promise<boolean> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.guestMode ?? "@auth_guest_mode";
    
    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) {
      if (__DEV__) {
        console.warn("[GuestModeStorage] No storage provider available");
      }
      return false;
    }

    const value = await storageProvider.get(key);
    return value === "true";
  } catch {
    return false;
  }
}

/**
 * Save guest mode to storage
 */
export async function saveGuestMode(isGuest: boolean, storageKey?: string): Promise<void> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.guestMode ?? "@auth_guest_mode";
    
    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) {
      if (__DEV__) {
        console.warn("[GuestModeStorage] No storage provider available");
      }
      return;
    }

    if (isGuest) {
      await storageProvider.set(key, "true");
      if (__DEV__) {
        console.log("[GuestModeStorage] Guest mode persisted to storage");
      }
    } else {
      await storageProvider.remove(key);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn("[GuestModeStorage] Failed to persist guest mode:", error);
    }
  }
}

/**
 * Clear guest mode from storage
 */
export async function clearGuestMode(storageKey?: string): Promise<void> {
  try {
    const packageConfig = getAuthPackage()?.getConfig();
    const key = storageKey ?? packageConfig?.storageKeys.guestMode ?? "@auth_guest_mode";
    
    const storageProvider = getAuthPackage()?.getStorageProvider();
    if (!storageProvider) {
      return;
    }

    await storageProvider.remove(key);
  } catch {
    // Ignore storage errors
  }
}

