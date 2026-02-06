/**
 * User Mapper
 * Single Source of Truth for user object transformations
 */

import type { AuthUser, AuthProviderType } from "../../domain/entities/AuthUser";

interface ProviderData {
  providerId: string | null;
}

interface FirebaseUserLike {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  photoURL: string | null;
  providerData?: (ProviderData | null)[];
}

/**
 * Extract auth provider from Firebase user's providerData
 */
function extractProvider(user: FirebaseUserLike): AuthProviderType {
  if (user.isAnonymous) {
    return "anonymous";
  }

  const providerData = user.providerData;
  if (!providerData || providerData.length === 0) {
    return "unknown";
  }

  const googleProvider = providerData.find((p) => p?.providerId === "google.com");
  if (googleProvider) return "google.com";

  const appleProvider = providerData.find((p) => p?.providerId === "apple.com");
  if (appleProvider) return "apple.com";

  const passwordProvider = providerData.find((p) => p?.providerId === "password");
  if (passwordProvider) return "password";

  return "unknown";
}

export function mapToAuthUser(user: FirebaseUserLike | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
    provider: extractProvider(user),
  };
}
