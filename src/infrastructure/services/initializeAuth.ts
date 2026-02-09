/**
 * Unified Auth Initialization
 * Initializes Firebase auth with user document sync and conversion tracking
 */

import type { Auth, User } from "firebase/auth";
import { getFirebaseAuth } from "@umituz/react-native-firebase";
import { initializeAuthService } from "./AuthService";
import { initializeAuthListener } from "../../presentation/stores/initializeAuthListener";
import { createAuthStateHandler } from "../utils/authStateHandler";
import type { ConversionState } from "../utils/authConversionDetector";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import type { IStorageProvider } from "../types/Storage.types";

export interface InitializeAuthOptions {
  storageProvider?: IStorageProvider;
  autoAnonymousSignIn?: boolean;
  onUserConverted?: (anonymousId: string, authenticatedId: string) => void | Promise<void>;
  onAuthStateChange?: (user: User | null) => void | Promise<void>;
  authConfig?: Partial<AuthConfig>;
}

let isInitialized = false;
let initializationPromise: Promise<{ success: boolean; auth: Auth | null }> | null = null;
const conversionState: { current: ConversionState } = {
  current: { previousUserId: null, wasAnonymous: false },
};

/**
 * Initialize auth services
 */
export async function initializeAuth(
  options: InitializeAuthOptions = {}
): Promise<{ success: boolean; auth: Auth | null }> {
  if (isInitialized) {
    return { success: true, auth: getFirebaseAuth() };
  }
  // Prevent race condition: return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise;
  }
  initializationPromise = doInitializeAuth(options);
  try {
    return await initializationPromise;
  } finally {
    initializationPromise = null;
  }
}

async function doInitializeAuth(
  options: InitializeAuthOptions
): Promise<{ success: boolean; auth: Auth | null }> {

  const {
    storageProvider,
    autoAnonymousSignIn = true,
    onUserConverted,
    onAuthStateChange,
    authConfig,
  } = options;

  const auth = getFirebaseAuth();
  if (!auth) return { success: false, auth: null };

  let authServiceInitFailed = false;
  try {
    await initializeAuthService(auth, authConfig, storageProvider);
  } catch {
    authServiceInitFailed = true;
  }

  const handleAuthStateChange = createAuthStateHandler(conversionState, {
    onUserConverted,
    onAuthStateChange,
  });

  initializeAuthListener({
    autoAnonymousSignIn,
    onAuthStateChange: (user) => {
      void handleAuthStateChange(user);
    },
  });

  isInitialized = true;
  return { success: !authServiceInitFailed, auth };
}

export function isAuthInitialized(): boolean {
  return isInitialized;
}

export function resetAuthInitialization(): void {
  isInitialized = false;
  conversionState.current = { previousUserId: null, wasAnonymous: false };
}
