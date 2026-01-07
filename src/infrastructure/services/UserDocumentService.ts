/**
 * User Document Service
 * Generic service for creating/updating user documents in Firestore
 */

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirestore } from "@umituz/react-native-firebase";
import type {
  UserDocumentUser,
  UserDocumentConfig,
  UserDocumentExtras,
} from "./UserDocument.types";

export type {
  UserDocumentUser,
  UserDocumentConfig,
  UserDocumentExtras,
} from "./UserDocument.types";

declare const __DEV__: boolean;

let userDocumentConfig: UserDocumentConfig = {};

export function configureUserDocumentService(config: UserDocumentConfig): void {
  userDocumentConfig = { ...config };
}

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

  const fields: (keyof UserDocumentExtras)[] = [
    'deviceId', 'platform', 'deviceModel', 'deviceBrand', 
    'osVersion', 'appVersion', 'buildNumber', 'locale', 'timezone'
  ];

  fields.forEach(field => {
    const val = extras?.[field];
    if (val) data[field] = val;
  });

  return data;
}

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

  if (extras?.signUpMethod) createData.signUpMethod = extras.signUpMethod;

  return createData;
}

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
    if (extras?.signUpMethod) updateData.signUpMethod = extras.signUpMethod;
  }

  return updateData;
}

export async function ensureUserDocument(
  user: UserDocumentUser | User,
  extras?: UserDocumentExtras,
): Promise<boolean> {
  const db = getFirestore();
  if (!db || !user.uid) return false;

  try {
    let allExtras = extras || {};
    if (userDocumentConfig.collectExtras) {
      const collectedExtras = await userDocumentConfig.collectExtras();
      allExtras = { ...collectedExtras, ...allExtras };
    }

    if (!allExtras.signUpMethod) allExtras.signUpMethod = getSignUpMethod(user);

    const collectionName = userDocumentConfig.collectionName || "users";
    const userRef = doc(db, collectionName, user.uid);
    const userDoc = await getDoc(userRef);
    const baseData = buildBaseData(user, allExtras);

    const docData = !userDoc.exists() 
      ? buildCreateData(baseData, allExtras) 
      : buildUpdateData(baseData, allExtras);

    await setDoc(userRef, docData, { merge: true });
    return true;
  } catch (error) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      // eslint-disable-next-line no-console
      console.error("[UserDocumentService] Failed:", error);
    }
    return false;
  }
}

export async function markUserDeleted(userId: string): Promise<boolean> {
  const db = getFirestore();
  if (!db || !userId) return false;

  try {
    const userRef = doc(db, userDocumentConfig.collectionName || "users", userId);
    await setDoc(userRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch {
    return false;
  }
}
