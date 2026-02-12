/**
 * Auth Service
 * Orchestrates authentication operations
 */

import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import { sanitizeAuthConfig } from "../../domain/value-objects/AuthConfig";
import { AuthRepository, type SignUpCredentials, type AuthCredentials } from "../repositories/AuthRepository";
import { AnonymousModeService } from "./AnonymousModeService";
import { authEventService } from "./AuthEventService";
import type { IStorageProvider } from "../types/Storage.types";

export class AuthService {
  private repository!: AuthRepository;
  private anonymousModeService: AnonymousModeService;
  private storageProvider?: IStorageProvider;
  private initialized: boolean = false;
  private config: AuthConfig;

  constructor(config: Partial<AuthConfig> = {}, storageProvider?: IStorageProvider) {
    this.config = sanitizeAuthConfig(config);
    this.anonymousModeService = new AnonymousModeService();
    this.storageProvider = storageProvider;
  }

  private get repositoryInstance(): AuthRepository {
    if (!this.initialized) throw new Error("AuthService not initialized");
    return this.repository;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.repository = new AuthRepository(this.config);

    if (this.storageProvider) {
      await this.anonymousModeService.load(this.storageProvider);
    }
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async signUp(params: SignUpCredentials): Promise<AuthUser> {
    const user = await this.repositoryInstance.signUp(params);
    await this.clearAnonymousModeIfNeeded();
    authEventService.emitUserAuthenticated(user.uid);
    return user;
  }

  async signIn(params: AuthCredentials): Promise<AuthUser> {
    const user = await this.repositoryInstance.signIn(params);
    await this.clearAnonymousModeIfNeeded();
    authEventService.emitUserAuthenticated(user.uid);
    return user;
  }

  async signOut(): Promise<void> {
    await this.repositoryInstance.signOut();
    await this.clearAnonymousModeIfNeeded();
  }

  private async clearAnonymousModeIfNeeded(): Promise<void> {
    if (this.anonymousModeService.getIsAnonymousMode() && this.storageProvider) {
      await this.anonymousModeService.clear(this.storageProvider);
    }
  }

  async setAnonymousMode(): Promise<void> {
    if (!this.storageProvider) throw new Error("Storage provider is required for anonymous mode");
    await this.anonymousModeService.enable(this.storageProvider);
  }

  getCurrentUser(): AuthUser | null {
    if (!this.initialized) return null;
    return this.repositoryInstance.getCurrentUser();
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
  config?: Partial<AuthConfig>,
  storageProvider?: IStorageProvider
): Promise<AuthService> {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService(config, storageProvider);
  }
  await authServiceInstance.initialize();
  return authServiceInstance;
}

export function getAuthService(): AuthService | null {
  return (authServiceInstance && authServiceInstance.isInitialized()) ? authServiceInstance : null;
}

export function resetAuthService(): void {
  authServiceInstance = null;
}
