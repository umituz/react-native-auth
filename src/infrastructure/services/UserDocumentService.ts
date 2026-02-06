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
import {
  getSignUpMethod,
  buildBaseData,
  buildCreateData,
  buildUpdateData,
} from "../utils/userDocumentBuilder.util";

export type {
  UserDocumentUser,
  UserDocumentConfig,
  UserDocumentExtras,
} from "./UserDocument.types";

let userDocumentConfig: UserDocumentConfig = {};

export function configureUserDocumentService(config: UserDocumentConfig): void {
  userDocumentConfig = { ...config };
}

export async function ensureUserDocument(
  user: UserDocumentUser | User,
  extras?: UserDocumentExtras,
): Promise<boolean> {
  const db = getFirestore();
  if (!db || !user.uid || user.uid.trim().length === 0) return false;

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
      ? buildCreateData(baseData, userDocumentConfig.extraFields, allExtras)
      : buildUpdateData(baseData, allExtras);

    await setDoc(userRef, docData, { merge: true });
    return true;
  } catch (error) {
    if (__DEV__) {
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
  } catch (error) {
    if (__DEV__) {
      console.error("[UserDocumentService] markUserDeleted failed:", error);
    }
    return false;
  }
}
