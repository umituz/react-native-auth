/**
 * User Mapper
 * Single Source of Truth for user object transformations
 */

import type { AuthUser } from "../../domain/entities/AuthUser";

interface FirebaseUserLike {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  photoURL: string | null;
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
  };
}
