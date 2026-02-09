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
  EmailAuthProvider,
  linkWithCredential,
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

  initialize(): Promise<void> {
    if (!this.auth) {
      throw new Error("Firebase Auth instance must be provided");
    }
    return Promise.resolve();
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
      const currentUser = this.auth.currentUser;
      const isAnonymous = currentUser?.isAnonymous ?? false;

      let userCredential;

      // Convert anonymous user to permanent account
      if (currentUser && isAnonymous) {
        // Reload user to refresh token before linking (prevents token-expired errors)
        try {
          await currentUser.reload();
        } catch {
          // Reload failed, proceed with link anyway
        }

        const credential = EmailAuthProvider.credential(
          credentials.email.trim(),
          credentials.password
        );

        userCredential = await linkWithCredential(currentUser, credential);
      } else {
        // Create new user
        userCredential = await createUserWithEmailAndPassword(
          this.auth,
          credentials.email.trim(),
          credentials.password
        );
      }

      if (credentials.displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: credentials.displayName.trim(),
          });
        } catch {
          // Silently fail - the account was created successfully,
          // only the display name update failed. User can update it later.
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
    if (!this.auth) {
      return null;
    }
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return null;
    }
    return mapToAuthUser(currentUser);
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
