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
import { AnonymousModeService } from "./AnonymousModeService";
import { authEventService } from "./AuthEventService";
import { authTracker } from "../utils/auth-tracker.util";
import type { IStorageProvider } from "../types/Storage.types";

export class AuthService implements IAuthService {
  private repository!: AuthRepository;
  private anonymousModeService: AnonymousModeService;
  private storageProvider?: IStorageProvider;
  private initialized: boolean = false;
  private config: AuthConfig;

  constructor(config: Partial<AuthConfig> = {}, storageProvider?: IStorageProvider) {
    this.config = {
      ...DEFAULT_AUTH_CONFIG,
      ...config,
      password: { ...DEFAULT_AUTH_CONFIG.password, ...config.password },
    };

    this.anonymousModeService = new AnonymousModeService();
    this.storageProvider = storageProvider;
  }

  private get repositoryInstance(): AuthRepository {
    if (!this.initialized) throw new Error("AuthService not initialized");
    return this.repository;
  }

  async initialize(providerOrAuth: IAuthProvider | Auth): Promise<void> {
    if (this.initialized) return;

    let provider: IAuthProvider;

    if ("currentUser" in providerOrAuth) {
      const firebaseProvider = new FirebaseAuthProvider(providerOrAuth as Auth);
      await firebaseProvider.initialize();
      provider = firebaseProvider;
    } else {
      provider = providerOrAuth;
      await provider.initialize();
    }

    this.repository = new AuthRepository(provider, this.config);

    if (this.storageProvider) {
      await this.anonymousModeService.load(this.storageProvider);
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
      await this.clearAnonymousModeIfNeeded();
      authTracker.logOperationSuccess("Sign up", { userId: user.uid });
      authEventService.emitUserAuthenticated(user.uid);
      return user;
    } catch (error) {
      authTracker.logOperationError("Sign up", error, { email: params.email });
      throw error;
    }
  }

  async signIn(params: SignInParams): Promise<AuthUser> {
    authTracker.logOperationStarted("Sign in", { email: params.email });
    try {
      const user = await this.repositoryInstance.signIn(params);
      await this.clearAnonymousModeIfNeeded();
      authTracker.logOperationSuccess("Sign in", { userId: user.uid });
      authEventService.emitUserAuthenticated(user.uid);
      return user;
    } catch (error) {
      authTracker.logOperationError("Sign in", error, { email: params.email });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    authTracker.logOperationStarted("Sign out");
    try {
      await this.repositoryInstance.signOut();
      await this.clearAnonymousModeIfNeeded();
      authTracker.logOperationSuccess("Sign out");
    } catch (error) {
      authTracker.logOperationError("Sign out", error);
      throw error;
    }
  }

  private async clearAnonymousModeIfNeeded(): Promise<void> {
    if (this.anonymousModeService.getIsAnonymousMode() && this.storageProvider) {
      await this.anonymousModeService.clear(this.storageProvider);
    }
  }

  async setAnonymousMode(): Promise<void> {
    if (!this.storageProvider) {
      throw new Error("Storage provider is required for anonymous mode");
    }
    await this.anonymousModeService.enable(this.storageProvider);
  }

  getCurrentUser(): AuthUser | null {
    if (!this.initialized) return null;
    return this.anonymousModeService.getIsAnonymousMode() ? null : this.repositoryInstance.getCurrentUser();
  }

  getIsAnonymousMode(): boolean {
    return this.anonymousModeService.getIsAnonymousMode();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const wrappedCallback = this.anonymousModeService.wrapAuthStateCallback(callback);
    return this.repositoryInstance.onAuthStateChange(wrappedCallback);
  }

  getConfig(): AuthConfig { return this.config; }
  getAnonymousModeService(): AnonymousModeService { return this.anonymousModeService; }
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
