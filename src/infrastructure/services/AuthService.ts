/**
 * Auth Service
 * Orchestrates authentication operations using composition
 */

import type { Auth } from "firebase/auth";
import type { IAuthService, SignUpParams, SignInParams } from "../../application/ports/IAuthService";
import type { IAuthProvider } from "../../application/ports/IAuthProvider";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import { DEFAULT_AUTH_CONFIG } from "../../domain/value-objects/AuthConfig";
import { AuthCoreService } from "./AuthCoreService";
import { GuestModeService, type IStorageProvider } from "./GuestModeService";
import { authEventService } from "./AuthEventService";
import { initializeAuthPackage, getAuthPackage } from "./AuthPackage";
import {
  trackPackageError,
  addPackageBreadcrumb,
} from "@umituz/react-native-sentry";

export class AuthService implements IAuthService {
  private coreService: AuthCoreService;
  private guestModeService: GuestModeService;
  private storageProvider?: IStorageProvider;
  private initialized: boolean = false;

  constructor(config: Partial<AuthConfig> = {}, storageProvider?: IStorageProvider) {
    const authConfig = {
      ...DEFAULT_AUTH_CONFIG,
      ...config,
      password: {
        ...DEFAULT_AUTH_CONFIG.password,
        ...config.password,
      },
    };

    this.coreService = new AuthCoreService(authConfig);
    this.guestModeService = new GuestModeService();
    this.storageProvider = storageProvider;
  }

  async initialize(providerOrAuth: IAuthProvider | Auth): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Initialize core service
    await this.coreService.initialize(providerOrAuth);

    // Initialize guest mode if storage provider is available
    if (this.storageProvider) {
      await this.guestModeService.load(this.storageProvider);
    }

    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized && this.coreService.isInitialized();
  }

  async signUp(params: SignUpParams): Promise<AuthUser> {
    addPackageBreadcrumb("auth", "Sign up started", {
      email: params.email,
    });

    try {
      const user = await this.coreService.signUp(params);

      // Clear guest mode when user signs up
      if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
        await this.guestModeService.clear(this.storageProvider);
      }

      addPackageBreadcrumb("auth", "Sign up successful", {
        userId: user.uid,
      });

      authEventService.emitUserAuthenticated(user.uid);
      return user;
    } catch (error) {
      trackPackageError(
        error instanceof Error ? error : new Error("Sign up failed"),
        {
          packageName: "auth",
          operation: "sign-up",
          email: params.email,
        }
      );
      throw error;
    }
  }

  async signIn(params: SignInParams): Promise<AuthUser> {
    addPackageBreadcrumb("auth", "Sign in started", {
      email: params.email,
    });

    try {
      const user = await this.coreService.signIn(params);

      // Clear guest mode when user signs in
      if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
        await this.guestModeService.clear(this.storageProvider);
      }

      addPackageBreadcrumb("auth", "Sign in successful", {
        userId: user.uid,
      });

      authEventService.emitUserAuthenticated(user.uid);
      return user;
    } catch (error) {
      trackPackageError(
        error instanceof Error ? error : new Error("Sign in failed"),
        {
          packageName: "auth",
          operation: "sign-in",
          email: params.email,
        }
      );
      throw error;
    }
  }

  async signOut(): Promise<void> {
    addPackageBreadcrumb("auth", "Sign out started");

    try {
      await this.coreService.signOut();

      // Clear guest mode if signing out explicitly
      if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
        await this.guestModeService.clear(this.storageProvider);
      }

      addPackageBreadcrumb("auth", "Sign out successful");
    } catch (error) {
      trackPackageError(
        error instanceof Error ? error : new Error("Sign out failed"),
        {
          packageName: "auth",
          operation: "sign-out",
        }
      );
      throw error;
    }
  }

  async setGuestMode(): Promise<void> {
    if (!this.storageProvider) {
      throw new Error("Storage provider is required for guest mode");
    }

    // No provider needed for guest mode enablement
    
    await this.guestModeService.enable(this.storageProvider);
  }

  getCurrentUser(): AuthUser | null {
    if (this.guestModeService.getIsGuestMode()) {
      return null;
    }
    return this.coreService.getCurrentUser();
  }

  getIsGuestMode(): boolean {
    return this.guestModeService.getIsGuestMode();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const wrappedCallback = this.guestModeService.wrapAuthStateCallback(callback);
    return this.coreService.onAuthStateChange(wrappedCallback);
  }

  getConfig(): AuthConfig {
    return this.coreService.getConfig();
  }

  getCoreService(): AuthCoreService {
    return this.coreService;
  }

  getGuestModeService(): GuestModeService {
    return this.guestModeService;
  }
}

// Singleton instance
let authServiceInstance: AuthService | null = null;

/**
 * Initialize auth service with provider or Firebase Auth instance
 */
export async function initializeAuthService(
  providerOrAuth: IAuthProvider | Auth,
  config?: Partial<AuthConfig>,
  storageProvider?: IStorageProvider
): Promise<AuthService> {
  if (!authServiceInstance) {
    // Initialize package if not already done
    const packageConfig = getAuthPackage()?.getConfig();
    authServiceInstance = new AuthService(config, storageProvider);
  }
  await authServiceInstance.initialize(providerOrAuth);
  return authServiceInstance;
}

/**
 * Get auth service instance
 */
export function getAuthService(): AuthService | null {
  if (!authServiceInstance || !authServiceInstance.isInitialized()) {
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
