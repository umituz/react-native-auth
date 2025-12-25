/**
 * Auth Core Service
 * Handles core authentication operations
 */

import type { IAuthService, SignUpParams, SignInParams } from "../../application/ports/IAuthService";
import type { IAuthProvider } from "../../application/ports/IAuthProvider";
import { FirebaseAuthProvider } from "../providers/FirebaseAuthProvider";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import {
  AuthInitializationError,
  AuthValidationError,
  AuthWeakPasswordError,
  AuthInvalidEmailError,
} from "../../domain/errors/AuthError";
import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validateDisplayName,
} from "../utils/AuthValidation";

export class AuthCoreService implements Partial<IAuthService> {
  private provider: IAuthProvider | null = null;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async initialize(
    providerOrAuth: IAuthProvider | Record<string, unknown>
  ): Promise<void> {
    if (!providerOrAuth) {
      throw new AuthInitializationError(
        "Auth provider or Firebase Auth instance is required"
      );
    }

    // Check if it's a Firebase Auth instance (has currentUser property)
    if ("currentUser" in providerOrAuth) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      const firebaseProvider = new FirebaseAuthProvider(providerOrAuth as any);
      await firebaseProvider.initialize();
      this.provider = firebaseProvider as unknown as IAuthProvider;
    } else {
      this.provider = providerOrAuth as IAuthProvider;
      await this.provider.initialize();
    }
  }


  isInitialized(): boolean {
    return this.provider !== null && this.provider.isInitialized();
  }

  private getProvider(): IAuthProvider {
    if (!this.provider || !this.provider.isInitialized()) {
      throw new AuthInitializationError("Auth service is not initialized");
    }
    return this.provider;
  }

  async signUp(params: SignUpParams): Promise<AuthUser> {
    const provider = this.getProvider();

    // Validate email
    const emailResult = validateEmail(params.email);
    if (!emailResult.isValid) {
      throw new AuthInvalidEmailError(emailResult.error);
    }

    // Validate display name if provided
    if (params.displayName) {
      const nameResult = validateDisplayName(params.displayName);
      if (!nameResult.isValid) {
        throw new AuthValidationError(nameResult.error || "Invalid name", "displayName");
      }
    }

    // Validate password strength for registration
    const passwordResult = validatePasswordForRegister(params.password, this.config.password);
    if (!passwordResult.isValid) {
      throw new AuthWeakPasswordError(passwordResult.error);
    }

    return provider.signUp({
      email: params.email,
      password: params.password,
      displayName: params.displayName,
    });
  }

  async signIn(params: SignInParams): Promise<AuthUser> {
    const provider = this.getProvider();

    // Validate email format
    const emailResult = validateEmail(params.email);
    if (!emailResult.isValid) {
      throw new AuthInvalidEmailError(emailResult.error);
    }

    // For login, only check if password is provided (no strength requirements)
    const passwordResult = validatePasswordForLogin(params.password);
    if (!passwordResult.isValid) {
      throw new AuthValidationError(passwordResult.error || "Password is required", "password");
    }

    return provider.signIn({
      email: params.email,
      password: params.password,
    });
  }

  async signOut(): Promise<void> {
    if (!this.provider) {
      return;
    }

    await this.provider.signOut();
  }

  getCurrentUser(): AuthUser | null {
    if (!this.provider) {
      return null;
    }
    return this.provider.getCurrentUser();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!this.provider) {
      callback(null);
      return () => { };
    }

    return this.provider.onAuthStateChange(callback);
  }

  getConfig(): AuthConfig {
    return this.config;
  }
}