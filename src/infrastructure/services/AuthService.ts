/**
 * Auth Service
 * Orchestrates authentication operations using composition
 */

import type { Auth } from "firebase/auth";
import type { IAuthService, SignUpParams, SignInParams } from "../../application/ports/IAuthService";
import type { IAuthProvider } from "../../application/ports/IAuthProvider";
import { FirebaseAuthProvider } from "../providers/FirebaseAuthProvider";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import { DEFAULT_AUTH_CONFIG } from "../../domain/value-objects/AuthConfig";
import { AuthRepository } from "../repositories/AuthRepository";
import { GuestModeService } from "./GuestModeService";
import { authEventService } from "./AuthEventService";
import { authTracker } from "../utils/auth-tracker.util";
import type { IStorageProvider } from "./AuthPackage";

export class AuthService implements IAuthService {
  private repository!: AuthRepository;
  private guestModeService: GuestModeService;
  private storageProvider?: IStorageProvider;
  private initialized: boolean = false;
  private config: AuthConfig;

  constructor(config: Partial<AuthConfig> = {}, storageProvider?: IStorageProvider) {
    this.config = {
      ...DEFAULT_AUTH_CONFIG,
      ...config,
      password: { ...DEFAULT_AUTH_CONFIG.password, ...config.password },
    };
    // Initialize with a dummy provider effectively, or null?
    // AuthRepository needs a provider. We can't init it without one.
    // We'll initialize it properly in initialize()
    // For now we can cast null or strict init check.
    // Better: Allow repository to be nullable or initialize with a dummy/proxy.
    // To satisfy strict TS, let's delay repository creation or create a NotInitializedProvider.
    // But since initialize() sets it up, we can use a ! or optional.

    this.guestModeService = new GuestModeService();
    this.storageProvider = storageProvider;

    // We can't instantiate AuthRepository yet if we don't have provider.
    // So we'll have to keep it optional or allow late init.
  }

  private get repositoryInstance(): AuthRepository {
    if (!this.initialized) throw new Error("AuthService not initialized");
    return this.repository;
  }

  async initialize(providerOrAuth: IAuthProvider | Auth): Promise<void> {
    if (this.initialized) return;

    let provider: IAuthProvider;

    // Check if it's a Firebase Auth instance (has currentUser property)
    if ("currentUser" in providerOrAuth) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      const firebaseProvider = new FirebaseAuthProvider(providerOrAuth as any);
      await firebaseProvider.initialize();
      provider = firebaseProvider as unknown as IAuthProvider;
    } else {
      provider = providerOrAuth;
      await provider.initialize();
    }

    this.repository = new AuthRepository(provider, this.config);

    if (this.storageProvider) {
      await this.guestModeService.load(this.storageProvider);
    }
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async signUp(params: SignUpParams): Promise<AuthUser> {
    authTracker.logOperationStarted("Sign up", { email: params.email });
    try {
      const user = await this.repositoryInstance.signUp(params);
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
      const user = await this.repositoryInstance.signIn(params);
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
      await this.repositoryInstance.signOut();
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
    if (!this.initialized) return null;
    return this.guestModeService.getIsGuestMode() ? null : this.repositoryInstance.getCurrentUser();
  }

  getIsGuestMode(): boolean {
    return this.guestModeService.getIsGuestMode();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const wrappedCallback = this.guestModeService.wrapAuthStateCallback(callback);
    return this.repositoryInstance.onAuthStateChange(wrappedCallback);
  }

  getConfig(): AuthConfig { return this.config; }
  getGuestModeService(): GuestModeService { return this.guestModeService; }
  getRepository(): AuthRepository { return this.repositoryInstance; }
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
