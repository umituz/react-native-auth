/**
 * Auth Service Implementation
 * Secure Firebase Authentication wrapper
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
import type { IAuthService, SignUpParams, SignInParams } from "../../application/ports/IAuthService";
import {
  AuthError,
  AuthInitializationError,
  AuthConfigurationError,
  AuthValidationError,
  AuthWeakPasswordError,
  AuthInvalidEmailError,
  AuthEmailAlreadyInUseError,
  AuthWrongPasswordError,
  AuthUserNotFoundError,
  AuthNetworkError,
} from "../../domain/errors/AuthError";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import { DEFAULT_AUTH_CONFIG } from "../../domain/value-objects/AuthConfig";

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password strength
 */
function validatePassword(
  password: string,
  config: Required<Omit<AuthConfig, "onUserCreated" | "onUserUpdated" | "onSignOut">>
): { valid: boolean; error?: string } {
  if (password.length < config.minPasswordLength) {
    return {
      valid: false,
      error: `Password must be at least ${config.minPasswordLength} characters long`,
    };
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (config.requireNumbers && !/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one number",
    };
  }

  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one special character",
    };
  }

  return { valid: true };
}

/**
 * Map Firebase Auth errors to domain errors
 */
function mapFirebaseAuthError(error: any): Error {
  // Extract error code and message
  const code = error?.code || "";
  const message = error?.message || "Authentication failed";

  // Firebase Auth error codes
  if (code === "auth/email-already-in-use") {
    return new AuthEmailAlreadyInUseError();
  }
  if (code === "auth/invalid-email") {
    return new AuthInvalidEmailError();
  }
  if (code === "auth/weak-password") {
    return new AuthWeakPasswordError();
  }
  if (code === "auth/user-disabled") {
    return new AuthError("User account has been disabled", "AUTH_USER_DISABLED");
  }
  if (code === "auth/user-not-found") {
    return new AuthUserNotFoundError();
  }
  if (code === "auth/wrong-password") {
    return new AuthWrongPasswordError();
  }
  if (code === "auth/network-request-failed") {
    return new AuthNetworkError();
  }
  if (code === "auth/too-many-requests") {
    return new AuthError("Too many requests. Please try again later.", "AUTH_TOO_MANY_REQUESTS");
  }
  if (code === "auth/configuration-not-found" || code === "auth/app-not-authorized") {
    return new AuthConfigurationError("Authentication is not properly configured. Please contact support.");
  }
  if (code === "auth/operation-not-allowed") {
    return new AuthConfigurationError("Email/password authentication is not enabled. Please contact support.");
  }

  return new AuthError(message, code);
}

export class AuthService implements IAuthService {
  private auth: Auth | null = null;
  private config: AuthConfig;
  private isGuestMode: boolean = false;

  constructor(config: AuthConfig = {}) {
    this.config = { ...DEFAULT_AUTH_CONFIG, ...config };
  }

  /**
   * Initialize auth service with Firebase Auth instance
   * Must be called before using any auth methods
   */
  initialize(auth: Auth): void {
    if (!auth) {
      throw new AuthInitializationError("Auth instance is required");
    }
    this.auth = auth;
    this.isGuestMode = false;
  }

  /**
   * Check if auth is initialized
   */
  isInitialized(): boolean {
    return this.auth !== null;
  }

  private getAuth(): Auth | null {
    if (!this.auth) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn("Auth service is not initialized. Call initialize() first.");
      }
      return null;
    }
    return this.auth;
  }

  /**
   * Sign up a new user
   */
  async signUp(params: SignUpParams): Promise<User> {
    const auth = this.getAuth();
    if (!auth) {
      throw new AuthInitializationError("Auth service is not initialized");
    }

    // Validate email
    if (!params.email || !validateEmail(params.email)) {
      throw new AuthInvalidEmailError();
    }

    // Validate password
    const passwordValidation = validatePassword(params.password, this.config as any);
    if (!passwordValidation.valid) {
      throw new AuthWeakPasswordError(passwordValidation.error);
    }

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        params.email.trim(),
        params.password
      );

      // Update display name if provided
      if (params.displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, {
            displayName: params.displayName.trim(),
          });
        } catch (updateError) {
          // Don't fail signup if display name update fails
          // User can still use the app
        }
      }

      // Call user created callback if provided
      if (this.config.onUserCreated) {
        try {
          await this.config.onUserCreated(userCredential.user);
        } catch (callbackError) {
          // Don't fail signup if callback fails
        }
      }

      return userCredential.user;
    } catch (error: any) {
      throw mapFirebaseAuthError(error);
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(params: SignInParams): Promise<User> {
    const auth = this.getAuth();
    if (!auth) {
      throw new AuthInitializationError("Auth service is not initialized");
    }

    // Validate email
    if (!params.email || !validateEmail(params.email)) {
      throw new AuthInvalidEmailError();
    }

    // Validate password
    if (!params.password || params.password.length === 0) {
      throw new AuthValidationError("Password is required", "password");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        params.email.trim(),
        params.password
      );

      this.isGuestMode = false;
      return userCredential.user;
    } catch (error: any) {
      throw mapFirebaseAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    const auth = this.getAuth();
    if (!auth) {
      // If auth is not initialized, just clear guest mode
      this.isGuestMode = false;
      return;
    }

    try {
      await firebaseSignOut(auth);
      this.isGuestMode = false;

      // Call sign out callback if provided
      if (this.config.onSignOut) {
        try {
          await this.config.onSignOut();
        } catch (callbackError) {
          // Don't fail signout if callback fails
        }
      }
    } catch (error: any) {
      throw mapFirebaseAuthError(error);
    }
  }

  /**
   * Set guest mode (no authentication)
   */
  async setGuestMode(): Promise<void> {
    const auth = this.getAuth();

    // Sign out from Firebase if logged in
    if (auth && auth.currentUser) {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        // Ignore sign out errors when switching to guest mode
      }
    }

    this.isGuestMode = true;
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    if (!this.auth) {
      return null;
    }
    return this.auth.currentUser;
  }

  /**
   * Check if user is in guest mode
   */
  getIsGuestMode(): boolean {
    return this.isGuestMode;
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const auth = this.getAuth();
    if (!auth) {
      // Return no-op unsubscribe if auth is not initialized
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, (user) => {
      // Don't update if in guest mode
      if (!this.isGuestMode) {
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

/**
 * Singleton instance
 * Apps should use initializeAuthService() to set up with their Firebase Auth instance
 */
let authServiceInstance: AuthService | null = null;

/**
 * Initialize auth service with Firebase Auth instance
 * Must be called before using any auth methods
 */
export function initializeAuthService(
  auth: Auth,
  config?: AuthConfig
): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService(config);
  }
  authServiceInstance.initialize(auth);
  return authServiceInstance;
}

/**
 * Get auth service instance
 * Returns null if service is not initialized (graceful degradation)
 */
export function getAuthService(): AuthService | null {
  if (!authServiceInstance || !authServiceInstance.isInitialized()) {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.warn(
        "Auth service is not initialized. Call initializeAuthService() first."
      );
    }
    return null;
  }
  return authServiceInstance;
}

/**
 * Reset auth service (useful for testing)
 */
export function resetAuthService(): void {
  authServiceInstance = null;
}

