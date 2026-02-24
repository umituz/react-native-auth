import { PersistentDeviceIdService } from '@umituz/react-native-design-system/device';
import { getFirebaseAuth } from '@umituz/react-native-firebase';

/**
 * Get the effective user ID for services that need to track user data
 *
 * Returns:
 * - Firebase Auth UID if user is authenticated (not anonymous)
 * - Device ID if user is anonymous or not logged in
 *
 * This ensures:
 * - Each authenticated user has their own data (subscriptions, credits, etc.)
 * - Anonymous users are tracked by device
 * - Multiple accounts on same device don't share data
 *
 * @returns Promise<string> User ID for service identification
 *
 * @example
 * ```typescript
 * const userId = await getEffectiveUserId();
 * // Authenticated user: "firebase_uid_123"
 * // Anonymous user: "device_abc456"
 * ```
 */
export async function getEffectiveUserId(): Promise<string> {
  const auth = getFirebaseAuth();
  const currentUser = auth?.currentUser;

  if (currentUser && !currentUser.isAnonymous) {
    return currentUser.uid;
  }

  return PersistentDeviceIdService.getDeviceId();
}
