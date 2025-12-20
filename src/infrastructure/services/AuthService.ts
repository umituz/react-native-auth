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
    const user = await this.coreService.signUp(params);

    // Clear guest mode when user signs up
    if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
      await this.guestModeService.clear(this.storageProvider);
    }

    authEventService.emitUserAuthenticated(user.uid);
    return user;
  }

  async signIn(params: SignInParams): Promise<AuthUser> {
    const user = await this.coreService.signIn(params);

    // Clear guest mode when user signs in
    if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
      await this.guestModeService.clear(this.storageProvider);
    }

    authEventService.emitUserAuthenticated(user.uid);
    return user;
  }

  async signOut(): Promise<void> {
    await this.coreService.signOut();

    // Clear guest mode if signing out explicitly
    if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
      await this.guestModeService.clear(this.storageProvider);
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
