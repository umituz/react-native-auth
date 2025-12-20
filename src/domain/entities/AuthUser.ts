/**
 * Auth User Entity
 * Provider-agnostic user representation
 */

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  photoURL: string | null;
}
