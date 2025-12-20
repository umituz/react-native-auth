/**
 * Firebase Auth Provider
 * IAuthProvider implementation for Firebase Authentication
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type Auth,
} from "firebase/auth";
import type {
  IAuthProvider,
  AuthCredentials,
  SignUpCredentials,
} from "../../application/ports/IAuthProvider";
import type { AuthUser } from "../../domain/entities/AuthUser";
import { mapFirebaseAuthError } from "../utils/AuthErrorMapper";
import { mapToAuthUser } from "../utils/UserMapper";

export class FirebaseAuthProvider implements IAuthProvider {
  private auth: Auth | null = null;

  constructor(auth?: Auth) {
    if (auth) {
      this.auth = auth;
    }
  }

  async initialize(): Promise<void> {
    if (!this.auth) {
      throw new Error("Firebase Auth instance must be provided");
    }
  }

  setAuth(auth: Auth): void {
    this.auth = auth;
  }

  isInitialized(): boolean {
    return this.auth !== null;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthUser> {
    if (!this.auth) {
      throw new Error("Firebase Auth is not initialized");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email.trim(),
        credentials.password
      );
      const user = mapToAuthUser(userCredential.user);
      if (!user) {
        throw new Error("Failed to sign in");
      }
      return user;
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error);
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
    if (!this.auth) {
      throw new Error("Firebase Auth is not initialized");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email.trim(),
        credentials.password
      );

      if (credentials.displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: credentials.displayName.trim(),
          });
        } catch {
          // Don't fail signup if display name update fails
        }
      }

      const user = mapToAuthUser(userCredential.user);
      if (!user) {
        throw new Error("Failed to create user account");
      }
      return user;
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    if (!this.auth) {
      return;
    }

    try {
      await firebaseSignOut(this.auth);
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error);
    }
  }

  getCurrentUser(): AuthUser | null {
    if (!this.auth?.currentUser) {
      return null;
    }
    return mapToAuthUser(this.auth.currentUser);
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!this.auth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(this.auth, (user) => {
      callback(mapToAuthUser(user));
    });
  }
}
