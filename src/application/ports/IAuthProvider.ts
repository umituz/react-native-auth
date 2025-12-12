/**
 * Auth Provider Interface
 * Port for provider-agnostic authentication (Firebase, Supabase, etc.)
 */

import type { AuthUser } from "../../domain/entities/AuthUser";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  displayName?: string;
}

export interface IAuthProvider {
  /**
   * Initialize the auth provider
   */
  initialize(): Promise<void>;

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean;

  /**
   * Sign in with email and password
   */
  signIn(credentials: AuthCredentials): Promise<AuthUser>;

  /**
   * Sign up with email, password, and optional display name
   */
  signUp(credentials: SignUpCredentials): Promise<AuthUser>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null;

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
