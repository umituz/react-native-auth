/**
 * User Document Service
 * Generic service for creating/updating user documents in Firestore
 * Called automatically on auth state changes
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirestore } from "@umituz/react-native-firebase";

declare const __DEV__: boolean;

/**
 * Minimal user interface for document creation
 * Compatible with both Firebase User and AuthUser
 */
export interface UserDocumentUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

/**
 * Configuration for user document service
 */
export interface UserDocumentConfig {
  /** Firestore collection name (default: "users") */
  collectionName?: string;
  /** Additional fields to store with user document */
  extraFields?: Record<string, unknown>;
  /** Callback to collect device/app info */
  collectExtras?: () => Promise<Record<string, unknown>>;
}

/**
 * User document extras from device/app
 */
export interface UserDocumentExtras {
  deviceId?: string;
  platform?: string;
  deviceModel?: string;
  deviceBrand?: string;
  osVersion?: string;
  appVersion?: string;
  buildNumber?: string;
  locale?: string;
  timezone?: string;
  previousAnonymousUserId?: string;
  signUpMethod?: string;
}

let userDocumentConfig: UserDocumentConfig = {};

/**
 * Configure user document service
 */
export function configureUserDocumentService(config: UserDocumentConfig): void {
  userDocumentConfig = { ...config };
}

/**
 * Get sign-up method from auth user
 */
function getSignUpMethod(user: UserDocumentUser): string | undefined {
  if (user.isAnonymous) return "anonymous";
  if (user.email) {
    const providerData = (
      user as unknown as { providerData?: { providerId: string }[] }
    ).providerData;
    if (providerData && providerData.length > 0) {
      const providerId = providerData[0].providerId;
      if (providerId === "google.com") return "google";
      if (providerId === "apple.com") return "apple";
      if (providerId === "password") return "email";
    }
    return "email";
  }
  return undefined;
}

/**
 * Build base user data from auth user
 */
function buildBaseData(
  user: UserDocumentUser,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };

  if (extras?.deviceId) data.deviceId = extras.deviceId;
  if (extras?.platform) data.platform = extras.platform;
  if (extras?.deviceModel) data.deviceModel = extras.deviceModel;
  if (extras?.deviceBrand) data.deviceBrand = extras.deviceBrand;
  if (extras?.osVersion) data.osVersion = extras.osVersion;
  if (extras?.appVersion) data.appVersion = extras.appVersion;
  if (extras?.buildNumber) data.buildNumber = extras.buildNumber;
  if (extras?.locale) data.locale = extras.locale;
  if (extras?.timezone) data.timezone = extras.timezone;

  return data;
}

/**
 * Build create data for new user document
 */
function buildCreateData(
  baseData: Record<string, unknown>,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const createData: Record<string, unknown> = {
    ...baseData,
    ...userDocumentConfig.extraFields,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  if (extras?.previousAnonymousUserId) {
    createData.previousAnonymousUserId = extras.previousAnonymousUserId;
    createData.convertedFromAnonymous = true;
    createData.convertedAt = serverTimestamp();
  }

  if (extras?.signUpMethod) {
    createData.signUpMethod = extras.signUpMethod;
  }

  return createData;
}

/**
 * Build update data for existing user document
 */
function buildUpdateData(
  baseData: Record<string, unknown>,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {
    ...baseData,
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (extras?.previousAnonymousUserId) {
    updateData.previousAnonymousUserId = extras.previousAnonymousUserId;
    updateData.convertedFromAnonymous = true;
    updateData.convertedAt = serverTimestamp();
    if (extras?.signUpMethod) {
      updateData.signUpMethod = extras.signUpMethod;
    }
  }

  return updateData;
}

/**
 * Ensure user document exists in Firestore
 * Creates new document or updates existing one
 */
export async function ensureUserDocument(
  user: UserDocumentUser | User,
  extras?: UserDocumentExtras,
): Promise<boolean> {
  const db = getFirestore();
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    // eslint-disable-next-line no-console
    console.log("[UserDocumentService] db:", !!db, "type:", typeof db, "constructor:", db?.constructor?.name);
  }
  if (!db || !user.uid) return false;

  try {
    // Collect additional extras if configured
    let allExtras = extras || {};
    if (userDocumentConfig.collectExtras) {
      const collectedExtras = await userDocumentConfig.collectExtras();
      allExtras = { ...collectedExtras, ...allExtras };
    }

    // Add sign-up method if not provided
    if (!allExtras.signUpMethod) {
      allExtras.signUpMethod = getSignUpMethod(user);
    }

    const collectionName = userDocumentConfig.collectionName || "users";
    const userRef = doc(db, collectionName, user.uid);
    const userDoc = await getDoc(userRef);
    const baseData = buildBaseData(user, allExtras);

    if (!userDoc.exists()) {
      const createData = buildCreateData(baseData, allExtras);
      await setDoc(userRef, createData);
    } else {
      const updateData = buildUpdateData(baseData, allExtras);
      await setDoc(userRef, updateData, { merge: true });
    }

    return true;
  } catch (error) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.error("[UserDocumentService] Failed:", error);
    }
    return false;
  }
}

/**
 * Mark user as deleted (soft delete)
 */
export async function markUserDeleted(userId: string): Promise<boolean> {
  const db = getFirestore();
  if (!db || !userId) return false;

  try {
    const collectionName = userDocumentConfig.collectionName || "users";
    const userRef = doc(db, collectionName, userId);
    await setDoc(
      userRef,
      {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  } catch {
    return false;
  }
}
