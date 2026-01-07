/**
 * User Document Types and Configuration
 */

/**
 * Minimal user interface for document creation
 * Compatible with both Firebase User and AuthUser
 */
export interface UserDocumentUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}

/**
 * Configuration for user document service
 */
export interface UserDocumentConfig {
  /** Firestore collection name (default: "users") */
  collectionName?: string;
  /** Additional fields to store with user document */
  extraFields?: Record<string, unknown>;
  /** Callback to collect device/app info */
  collectExtras?: () => Promise<Record<string, unknown>>;
}

/**
 * User document extras from device/app
 */
export interface UserDocumentExtras {
  deviceId?: string;
  platform?: string;
  deviceModel?: string;
  deviceBrand?: string;
  osVersion?: string;
  appVersion?: string;
  buildNumber?: string;
  locale?: string;
  timezone?: string;
  previousAnonymousUserId?: string;
  signUpMethod?: string;
}
