/**
 * User Document Builder Utility
 * Builds user document data for Firestore
 */

import { serverTimestamp } from "firebase/firestore";
import type {
  UserDocumentUser,
  UserDocumentExtras,
} from "../../infrastructure/services/UserDocument.types";
import { extractProvider } from "./UserMapper";
import type { AuthProviderType } from "../../domain/entities/AuthUser";

/**
 * Map AuthProviderType to sign-up method string
 */
const PROVIDER_TO_SIGNUP_METHOD: Record<string, string> = {
  "google.com": "google",
  "apple.com": "apple",
  "password": "email",
  "anonymous": "anonymous",
};

/**
 * Gets the sign-up method from user provider data
 * Uses extractProvider from UserMapper as single source of truth for provider detection
 */
export function getSignUpMethod(user: UserDocumentUser): string | undefined {
  const provider: AuthProviderType = extractProvider(user as Parameters<typeof extractProvider>[0]);
  if (provider === "unknown") return user.email ? "email" : undefined;
  return PROVIDER_TO_SIGNUP_METHOD[provider];
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

  if (extras) {
    const internalFields = ["signUpMethod", "previousAnonymousUserId"];
    Object.keys(extras).forEach((key) => {
      if (!internalFields.includes(key)) {
        const val = extras[key];
        if (val !== undefined) {
          data[key] = val;
        }
      }
    });
  }

  return data;
}

/**
 * Apply anonymous-to-authenticated conversion fields to document data
 */
function applyConversionFields(data: Record<string, unknown>, extras?: UserDocumentExtras): void {
  if (extras?.previousAnonymousUserId) {
    data.previousAnonymousUserId = extras.previousAnonymousUserId;
    data.convertedFromAnonymous = true;
    data.convertedAt = serverTimestamp();
  }
  if (extras?.signUpMethod) {
    data.signUpMethod = extras.signUpMethod;
  }
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

  applyConversionFields(createData, extras);

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

  applyConversionFields(updateData, extras);

  return updateData;
}
