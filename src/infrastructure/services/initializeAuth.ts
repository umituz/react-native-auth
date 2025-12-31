/**
 * Unified Auth Initialization
 * Single function to initialize all auth services
 *
 * Combines:
 * - AuthService (email/password auth)
 * - Auth Listener (state management)
 * - User Document Service (Firestore)
 * - Anonymous-to-authenticated conversion detection
 */

import type { Auth, User } from "firebase/auth";
import { getFirebaseAuth } from "@umituz/react-native-firebase";
import { initializeAuthService } from "./AuthService";
import { configureUserDocumentService, ensureUserDocument } from "./UserDocumentService";
import type { UserDocumentConfig } from "./UserDocumentService";
import { initializeAuthListener } from "../../presentation/stores/initializeAuthListener";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";

/**
 * Unified auth initialization options
 */
export interface InitializeAuthOptions {
  /** User document collection name (default: "users") */
  userCollection?: string;

  /** Additional fields to store with user documents */
  extraFields?: Record<string, unknown>;

  /** Callback to collect device/app info for user documents */
  collectExtras?: () => Promise<Record<string, unknown>>;

  /** Enable auto anonymous sign-in (default: true) */
  autoAnonymousSignIn?: boolean;

  /**
   * Callback when user converts from anonymous to authenticated
   * Use this to migrate user data (e.g., call Cloud Function)
   *
   * @param anonymousUserId - The previous anonymous user ID
   * @param authenticatedUserId - The new authenticated user ID
   */
  onUserConverted?: (
    anonymousUserId: string,
    authenticatedUserId: string
  ) => void | Promise<void>;

  /**
   * Callback when auth state changes (after user document is ensured)
   * Called for every auth state change including initial load
   */
  onAuthStateChange?: (user: User | null) => void | Promise<void>;

  /** Auth configuration (password rules, etc.) */
  authConfig?: Partial<AuthConfig>;
}

let isInitialized = false;

// Track previous user for conversion detection
let previousUserId: string | null = null;
let wasAnonymous = false;

/**
 * Initialize all auth services with a single call
 *
 * @example
 * ```typescript
 * import { initializeAuth } from '@umituz/react-native-auth';
 * import { migrateUserData } from '@domains/migration';
 *
 * await initializeAuth({
 *   userCollection: 'users',
 *   autoAnonymousSignIn: true,
 *   onUserConverted: async (anonymousId, authId) => {
 *     await migrateUserData(anonymousId, authId);
 *   },
 * });
 * ```
 */
export async function initializeAuth(
  options: InitializeAuthOptions = {}
): Promise<{ success: boolean; auth: Auth | null }> {
  if (isInitialized) {
    const auth = getFirebaseAuth();
    return { success: true, auth };
  }

  const {
    userCollection = "users",
    extraFields,
    collectExtras,
    autoAnonymousSignIn = true,
    onUserConverted,
    onAuthStateChange,
    authConfig,
  } = options;

  // 1. Configure user document service
  const userDocConfig: UserDocumentConfig = {
    collectionName: userCollection,
  };
  if (extraFields) userDocConfig.extraFields = extraFields;
  if (collectExtras) userDocConfig.collectExtras = collectExtras;

  configureUserDocumentService(userDocConfig);

  // 2. Get Firebase Auth
  const auth = getFirebaseAuth();
  if (!auth) {
    return { success: false, auth: null };
  }

  // 3. Initialize AuthService (for email/password auth)
  try {
    await initializeAuthService(auth, authConfig);
  } catch {
    // AuthService initialization failed, but we can continue
    // Email/password auth won't work, but social/anonymous will
  }

  // 4. Initialize Auth Listener (for state management)
  initializeAuthListener({
    autoAnonymousSignIn,
    onAuthStateChange: async (user) => {
      if (!user) {
        // User signed out
        previousUserId = null;
        wasAnonymous = false;
        onAuthStateChange?.(null);
        return;
      }

      const currentUserId = user.uid;
      const isCurrentlyAnonymous = user.isAnonymous ?? false;

      // Detect anonymous-to-authenticated conversion
      if (
        previousUserId &&
        previousUserId !== currentUserId &&
        wasAnonymous &&
        !isCurrentlyAnonymous &&
        onUserConverted
      ) {
        try {
          await onUserConverted(previousUserId, currentUserId);
        } catch {
          // Migration failed but don't block user flow
        }
      }

      // Create/update user document in Firestore
      await ensureUserDocument(user);

      // Update tracking state
      previousUserId = currentUserId;
      wasAnonymous = isCurrentlyAnonymous;

      // Call app's custom callback
      onAuthStateChange?.(user);
    },
  });

  isInitialized = true;
  return { success: true, auth };
}

/**
 * Check if auth is initialized
 */
export function isAuthInitialized(): boolean {
  return isInitialized;
}

/**
 * Reset auth initialization state (for testing)
 */
export function resetAuthInitialization(): void {
  isInitialized = false;
  previousUserId = null;
  wasAnonymous = false;
}
