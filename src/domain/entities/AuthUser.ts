/**
 * Auth User Entity
 * Provider-agnostic user representation
 */

export type AuthProviderType = "google.com" | "apple.com" | "password" | "anonymous" | "unknown";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  photoURL: string | null;
  provider: AuthProviderType;
}
