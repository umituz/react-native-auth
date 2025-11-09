/**
 * Auth Service Interface
 * Port for authentication operations
 */

import type { User } from "firebase/auth";

export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
  username?: string; // Added: Username support for app-specific needs
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface IAuthService {
  /**
   * Sign up a new user
   */
  signUp(params: SignUpParams): Promise<User>;

  /**
   * Sign in an existing user
   */
  signIn(params: SignInParams): Promise<User>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Set guest mode (no authentication)
   */
  setGuestMode(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null;

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void;

  /**
   * Check if auth is initialized
   */
  isInitialized(): boolean;
}

