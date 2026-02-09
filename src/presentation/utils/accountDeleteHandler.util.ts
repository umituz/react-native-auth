/**
 * Account Delete Handler Utility
 * Handles reauthentication flow for account deletion
 */

import { deleteCurrentUser } from "@umituz/react-native-firebase";

export interface DeleteAccountCallbacks {
  onReauthRequired?: () => Promise<boolean>;
  onPasswordRequired?: () => Promise<string | null>;
}

export interface DeleteAccountOptions {
  autoReauthenticate: boolean;
  password?: string;
}

/**
 * Handles account deletion with reauthentication retry logic
 */
export async function handleAccountDeletion(
  callbacks: DeleteAccountCallbacks
): Promise<void> {
  const result = await deleteCurrentUser({ autoReauthenticate: true });

  if (result.success) {
    return;
  }

  if (result.error?.requiresReauth) {
    await handleReauthentication(result, callbacks);
    return;
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
}

async function handleReauthentication(
  initialResult: Awaited<ReturnType<typeof deleteCurrentUser>>,
  callbacks: DeleteAccountCallbacks
): Promise<void> {
  const { onReauthRequired, onPasswordRequired } = callbacks;

  // Handle password reauth
  if (initialResult.error?.code === "auth/password-reauth" && onPasswordRequired) {
    await retryWithPassword(onPasswordRequired);
    return;
  }

  // Handle social auth reauth
  if (onReauthRequired) {
    await retryWithSocialAuth(onReauthRequired);
    return;
  }
}

async function retryWithPassword(onPasswordRequired: () => Promise<string | null>): Promise<void> {
  const password = await onPasswordRequired();

  if (!password) {
    throw new Error("Password required to delete account");
  }

  const result = await deleteCurrentUser({
    autoReauthenticate: false,
    password,
  });

  if (result.success) {
    return;
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
}

async function retryWithSocialAuth(onReauthRequired: () => Promise<boolean>): Promise<void> {
  const reauthSuccess = await onReauthRequired();

  if (!reauthSuccess) {
    throw new Error("Reauthentication required to delete account");
  }

  const result = await deleteCurrentUser({ autoReauthenticate: false });

  if (result.success) {
    return;
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
}
