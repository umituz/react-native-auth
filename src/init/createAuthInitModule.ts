/**
 * Auth Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import type { InitModule } from '@umituz/react-native-design-system';
import { initializeAuth } from '../infrastructure/services/initializeAuth';
import type { InitializeAuthOptions } from '../infrastructure/services/initializeAuth';

export interface AuthInitModuleConfig {
  /**
   * Whether to auto sign-in as anonymous user
   * @default true
   */
  autoAnonymousSignIn?: boolean;

  /**
   * Storage provider for auth persistence
   */
  storageProvider?: InitializeAuthOptions['storageProvider'];

  /**
   * Callback to restore purchases after user conversion
   * If provided, will be called after anonymous user converts to authenticated
   */
  onRestorePurchases?: () => Promise<void>;

  /**
   * Custom callback when user converts from anonymous to authenticated
   */
  onUserConverted?: (anonymousId: string, authenticatedId: string) => Promise<void>;

  /**
   * Whether this module is critical for app startup
   * @default true
   */
  critical?: boolean;

  /**
   * Module dependencies
   * @default ["firebase"]
   */
  dependsOn?: string[];
}

/**
 * Creates an Auth initialization module for use with createAppInitializer
 *
 * @example
 * ```typescript
 * import { createAppInitializer } from "@umituz/react-native-design-system";
 * import { createFirebaseInitModule } from "@umituz/react-native-firebase";
 * import { createAuthInitModule } from "@umituz/react-native-auth";
 * import { storageRepository, collectDeviceExtras } from "@umituz/react-native-design-system";
 *
 * export const initializeApp = createAppInitializer({
 *   modules: [
 *     createFirebaseInitModule(),
 *     createAuthInitModule({
 *       userCollection: "users",
 *       collectExtras: collectDeviceExtras,
 *       storageProvider: storageRepository,
 *     }),
 *   ],
 * });
 * ```
 */
export function createAuthInitModule(
  config: AuthInitModuleConfig = {}
): InitModule {
  const {
    autoAnonymousSignIn = true,
    storageProvider,
    onRestorePurchases,
    onUserConverted,
    critical = true,
    dependsOn = ['firebase'],
  } = config;

  return {
    name: 'auth',
    critical,
    dependsOn,
    init: async () => {
      try {
        await initializeAuth({
          autoAnonymousSignIn,
          storageProvider,
          onUserConverted: async (anonymousId: string, authenticatedId: string) => {
            if (__DEV__) {
              console.log('[createAuthInitModule] User converted:', {
                anonymousId: anonymousId.slice(0, 8),
                authenticatedId: authenticatedId.slice(0, 8),
              });
            }

            // Restore purchases after conversion (if callback provided)
            if (onRestorePurchases) {
              try {
                await onRestorePurchases();
                if (__DEV__) {
                  console.log('[createAuthInitModule] Purchases restored');
                }
              } catch (error) {
                if (__DEV__) {
                  console.error('[createAuthInitModule] Restore failed:', error);
                }
              }
            }

            // Call custom callback if provided
            if (onUserConverted) {
              await onUserConverted(anonymousId, authenticatedId);
            }
          },
        });

        if (__DEV__) {
          console.log('[createAuthInitModule] Auth initialized');
        }

        return true;
      } catch (error) {
        if (__DEV__) {
          console.error('[createAuthInitModule] Error:', error);
        }
        return false;
      }
    },
  };
}
