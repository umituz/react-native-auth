/**
 * Auth Provider Interface
 * Port for provider-agnostic authentication (Firebase, Supabase, etc.)
 */

import type { AuthUser } from "../../domain/entities/AuthUser";
import type { SocialAuthProvider } from "../../domain/value-objects/AuthConfig";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends AuthCredentials {
  displayName?: string;
}

/**
 * Result from social sign-in operations
 */
export interface SocialSignInResult {
  user: AuthUser;
  isNewUser: boolean;
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
   * Sign in with Google
   * @returns User and whether this is a new user
   */
  signInWithGoogle?(): Promise<SocialSignInResult>;

  /**
   * Sign in with Apple
   * @returns User and whether this is a new user
   */
  signInWithApple?(): Promise<SocialSignInResult>;

  /**
   * Check if a social provider is supported
   */
  isSocialProviderSupported?(provider: SocialAuthProvider): boolean;

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
