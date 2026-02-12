/**
 * User Document Repository
 * Manages Firestore user documents using Firebase Auth UID
 */

import { doc, setDoc, getDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";
import type { UserProfile } from "../../domain/entities/UserProfile";

const USERS_COLLECTION = "users";

/**
 * Create or update user document in Firestore
 * Uses Firebase Auth UID as document ID (best practice)
 */
export async function createOrUpdateUserDocument(
  firestore: Firestore,
  user: User
): Promise<void> {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userRef);

    const userData: Partial<UserProfile> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      lastLoginAt: new Date(),
    };

    if (!userDoc.exists()) {
      // New user - create document with createdAt
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // Existing user - update lastLoginAt only
      await setDoc(
        userRef,
        {
          lastLoginAt: serverTimestamp(),
          // Update these in case they changed (e.g., anonymous → registered)
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          isAnonymous: userData.isAnonymous,
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("[UserDocumentRepository] Failed to create/update user document:", error);
    // Don't throw - allow auth to continue even if Firestore fails
  }
}

/**
 * Check if user document exists
 */
export async function userDocumentExists(
  firestore: Firestore,
  uid: string
): Promise<boolean> {
  try {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error("[UserDocumentRepository] Failed to check user document:", error);
    return false;
  }
}

/**
 * Get Firestore instance
 * Exported for testing and external use
 */
export function getFirestoreInstance(): Firestore {
  return getFirestore();
}
