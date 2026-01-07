/**
 * User Document Builder Utility
 * Builds user document data for Firestore
 */

import { serverTimestamp } from "firebase/firestore";
import type {
  UserDocumentUser,
  UserDocumentExtras,
} from "../../infrastructure/services/UserDocument.types";

/**
 * Gets the sign-up method from user provider data
 */
export function getSignUpMethod(user: UserDocumentUser): string | undefined {
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
 * Builds base user data from user object and extras
 */
export function buildBaseData(
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

/**
 * Builds user document data for creation
 */
export function buildCreateData(
  baseData: Record<string, unknown>,
  extraFields: Record<string, unknown> | undefined,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const createData: Record<string, unknown> = {
    ...baseData,
    ...extraFields,
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

/**
 * Builds user document data for update
 */
export function buildUpdateData(
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
