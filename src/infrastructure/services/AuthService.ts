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
import { GuestModeService } from "./GuestModeService";
import { authEventService } from "./AuthEventService";
import { authTracker } from "../utils/auth-tracker.util";
import type { IStorageProvider } from "./AuthPackage";

export class AuthService implements IAuthService {
  private coreService: AuthCoreService;
  private guestModeService: GuestModeService;
  private storageProvider?: IStorageProvider;
  private initialized: boolean = false;

  constructor(config: Partial<AuthConfig> = {}, storageProvider?: IStorageProvider) {
    const authConfig = {
      ...DEFAULT_AUTH_CONFIG,
      ...config,
      password: { ...DEFAULT_AUTH_CONFIG.password, ...config.password },
    };
    this.coreService = new AuthCoreService(authConfig);
    this.guestModeService = new GuestModeService();
    this.storageProvider = storageProvider;
  }

  async initialize(providerOrAuth: IAuthProvider | Auth): Promise<void> {
    if (this.initialized) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    await this.coreService.initialize(providerOrAuth as any);
    if (this.storageProvider) {
      await this.guestModeService.load(this.storageProvider);
    }
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized && this.coreService.isInitialized();
  }

  async signUp(params: SignUpParams): Promise<AuthUser> {
    authTracker.logOperationStarted("Sign up", { email: params.email });
    try {
      const user = await this.coreService.signUp(params);
      await this.clearGuestModeIfNeeded();
      authTracker.logOperationSuccess("Sign up", { userId: user.uid });
      authEventService.emitUserAuthenticated(user.uid);
      return user;
    } catch (error) {
      authTracker.logOperationError("sign-up", error, { email: params.email });
      throw error;
    }
  }

  async signIn(params: SignInParams): Promise<AuthUser> {
    authTracker.logOperationStarted("Sign in", { email: params.email });
    try {
      const user = await this.coreService.signIn(params);
      await this.clearGuestModeIfNeeded();
      authTracker.logOperationSuccess("Sign in", { userId: user.uid });
      authEventService.emitUserAuthenticated(user.uid);
      return user;
    } catch (error) {
      authTracker.logOperationError("sign-in", error, { email: params.email });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    authTracker.logOperationStarted("Sign out");
    try {
      await this.coreService.signOut();
      await this.clearGuestModeIfNeeded();
      authTracker.logOperationSuccess("Sign out");
    } catch (error) {
      authTracker.logOperationError("sign-out", error);
      throw error;
    }
  }

  private async clearGuestModeIfNeeded(): Promise<void> {
    if (this.guestModeService.getIsGuestMode() && this.storageProvider) {
      await this.guestModeService.clear(this.storageProvider);
    }
  }

  async setGuestMode(): Promise<void> {
    if (!this.storageProvider) {
      throw new Error("Storage provider is required for guest mode");
    }
    await this.guestModeService.enable(this.storageProvider);
  }

  getCurrentUser(): AuthUser | null {
    return this.guestModeService.getIsGuestMode() ? null : this.coreService.getCurrentUser();
  }

  getIsGuestMode(): boolean {
    return this.guestModeService.getIsGuestMode();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const wrappedCallback = this.guestModeService.wrapAuthStateCallback(callback);
    return this.coreService.onAuthStateChange(wrappedCallback);
  }

  getConfig(): AuthConfig { return this.coreService.getConfig(); }
  getCoreService(): AuthCoreService { return this.coreService; }
  getGuestModeService(): GuestModeService { return this.guestModeService; }
}

let authServiceInstance: AuthService | null = null;

export async function initializeAuthService(
  providerOrAuth: IAuthProvider | Auth,
  config?: Partial<AuthConfig>,
  storageProvider?: IStorageProvider
): Promise<AuthService> {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService(config, storageProvider);
  }
  await authServiceInstance.initialize(providerOrAuth);
  return authServiceInstance;
}

export function getAuthService(): AuthService | null {
  return (authServiceInstance && authServiceInstance.isInitialized()) ? authServiceInstance : null;
}

export function resetAuthService(): void {
  authServiceInstance = null;
}
