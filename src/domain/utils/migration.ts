/**
 * User Data Migration Utilities
 * Handles migrating data when anonymous user converts to authenticated user
 */

export interface MigrationConfig {
  onMigrationStart?: (anonymousId: string, authId: string) => void;
  onMigrationComplete?: (anonymousId: string, authId: string) => void;
  onMigrationError?: (error: Error) => void;
}

let migrationConfig: MigrationConfig = {};

export const configureMigration = (config: MigrationConfig): void => {
  migrationConfig = config;
};

export const migrateUserData = (
  anonymousId: string,
  authId: string
): void => {
  if (__DEV__) {
    console.log(`[Migration] Starting migration from ${anonymousId} to ${authId}`);
  }

  try {
    migrationConfig.onMigrationStart?.(anonymousId, authId);

    // App-specific migration logic handled via callbacks
    // This keeps the package generic and flexible

    migrationConfig.onMigrationComplete?.(anonymousId, authId);

    if (__DEV__) {
      console.log(`[Migration] Successfully migrated data for ${authId}`);
    }
  } catch (error) {
    if (__DEV__) {
      console.error(`[Migration] Failed to migrate user data:`, error);
    }
    migrationConfig.onMigrationError?.(error as Error);
    // Silent fail - don't block auth flow
  }
};
