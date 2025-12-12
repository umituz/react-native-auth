/**
 * Auth Service Interface
 * Port for authentication operations (provider-agnostic)
 */

import type { AuthUser } from "../../domain/entities/AuthUser";

export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface IAuthService {
  /**
   * Sign up a new user
   */
  signUp(params: SignUpParams): Promise<AuthUser>;

  /**
   * Sign in an existing user
   */
  signIn(params: SignInParams): Promise<AuthUser>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Set guest mode (no authentication)
   */
  setGuestMode(): Promise<void>;

  /**
   * Check if currently in guest mode
   */
  getIsGuestMode(): boolean;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null;

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;

  /**
   * Check if auth is initialized
   */
  isInitialized(): boolean;
}

