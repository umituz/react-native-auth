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
export function extractProvider(user: FirebaseUserLike): AuthProviderType {
  if (user.isAnonymous) {
    return "anonymous";
  }

  const providerData = user.providerData;
  if (!providerData || providerData.length === 0) {
    return "unknown";
  }

  // Filter out null providers and find the first valid one
  const validProviders = providerData.filter((p): p is ProviderData => p != null);

  const googleProvider = validProviders.find((p) => p.providerId === "google.com");
  if (googleProvider && googleProvider.providerId) return "google.com";

  const appleProvider = validProviders.find((p) => p.providerId === "apple.com");
  if (appleProvider && appleProvider.providerId) return "apple.com";

  const passwordProvider = validProviders.find((p) => p.providerId === "password");
  if (passwordProvider && passwordProvider.providerId) return "password";

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
