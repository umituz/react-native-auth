/**
 * Unified Auth Initialization
 * Initializes auth with user document sync and conversion tracking
 */

import type { User } from "firebase/auth";
import { getFirebaseAuth, configureUserDocumentService } from "@umituz/react-native-firebase";
import type { UserDocumentExtras } from "@umituz/react-native-firebase";
import { initializeAuthService } from "./AuthService";
import { collectDeviceExtras } from "@umituz/react-native-design-system";
import { initializeAuthListener } from "../../presentation/stores/initializeAuthListener";
import { createAuthStateHandler } from "../utils/authStateHandler";
import type { ConversionState } from "../utils/authConversionDetector";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import type { IStorageProvider } from "../types/Storage.types";

export interface InitializeAuthOptions {
  userCollection?: string;
  extraFields?: Record<string, unknown>;
  collectExtras?: () => Promise<UserDocumentExtras>;
  storageProvider?: IStorageProvider;
  autoAnonymousSignIn?: boolean;
  onUserConverted?: (anonymousId: string, authenticatedId: string) => void | Promise<void>;
  onAuthStateChange?: (user: User | null) => void | Promise<void>;
  authConfig?: Partial<AuthConfig>;
}

let isInitialized = false;
let initializationPromise: Promise<{ success: boolean }> | null = null;
const conversionState: { current: ConversionState } = {
  current: { previousUserId: null, wasAnonymous: false },
};

/**
 * Initialize auth services
 */
export async function initializeAuth(
  options: InitializeAuthOptions = {}
): Promise<{ success: boolean }> {
  if (isInitialized) {
    return { success: true };
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
): Promise<{ success: boolean }> {

  const {
    userCollection = "users",
    extraFields,
    collectExtras,
    storageProvider,
    autoAnonymousSignIn = true,
    onUserConverted,
    onAuthStateChange,
    authConfig,
  } = options;

  let auth;
  try {
    auth = getFirebaseAuth();
  } catch {
    if (__DEV__) {
      console.warn('[Auth] Firebase Auth not available — skipping auth initialization.');
    }
    return { success: false };
  }

  if (!auth) {
    if (__DEV__) {
      console.warn('[Auth] Firebase Auth not initialized — skipping auth initialization.');
    }
    return { success: false };
  }

  configureUserDocumentService({
    collectionName: userCollection,
    extraFields,
    collectExtras: collectExtras || collectDeviceExtras,
  });

  let authServiceInitFailed = false;
  try {
    await initializeAuthService(authConfig, storageProvider);
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
  return { success: !authServiceInitFailed };
}

export function isAuthInitialized(): boolean {
  return isInitialized;
}

export function resetAuthInitialization(): void {
  isInitialized = false;
  conversionState.current = { previousUserId: null, wasAnonymous: false };
}
