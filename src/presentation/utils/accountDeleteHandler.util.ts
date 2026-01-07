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
  if (__DEV__) {
    console.log("[AccountDeleteHandler] Starting deletion with auto-reauthenticate");
  }

  const result = await deleteCurrentUser({ autoReauthenticate: true });

  if (__DEV__) {
    console.log("[AccountDeleteHandler] First attempt result:", result);
  }

  if (result.success) {
    if (__DEV__) {
      console.log("[AccountDeleteHandler] Delete successful");
    }
    return;
  }

  if (result.error?.requiresReauth) {
    await handleReauthentication(result, callbacks);
    return;
  }

  if (result.error) {
    if (__DEV__) {
      console.log("[AccountDeleteHandler] Delete failed:", result.error);
    }
    throw new Error(result.error.message);
  }
}

async function handleReauthentication(
  initialResult: Awaited<ReturnType<typeof deleteCurrentUser>>,
  callbacks: DeleteAccountCallbacks
): Promise<void> {
  const { onReauthRequired, onPasswordRequired } = callbacks;

  // Handle password reauth
  if (initialResult.error?.code === "auth/password-reauth-required" && onPasswordRequired) {
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
  if (__DEV__) {
    console.log("[AccountDeleteHandler] Prompting for password");
  }

  const password = await onPasswordRequired();

  if (!password) {
    if (__DEV__) {
      console.log("[AccountDeleteHandler] Password prompt cancelled");
    }
    throw new Error("Password required to delete account");
  }

  if (__DEV__) {
    console.log("[AccountDeleteHandler] Retrying with password");
  }

  const result = await deleteCurrentUser({
    autoReauthenticate: false,
    password,
  });

  if (__DEV__) {
    console.log("[AccountDeleteHandler] Password retry result:", result);
  }

  if (result.success) {
    if (__DEV__) {
      console.log("[AccountDeleteHandler] Delete successful after password reauth");
    }
    return;
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
}

async function retryWithSocialAuth(onReauthRequired: () => Promise<boolean>): Promise<void> {
  if (__DEV__) {
    console.log("[AccountDeleteHandler] Requesting social auth reauth");
  }

  const reauthSuccess = await onReauthRequired();

  if (__DEV__) {
    console.log("[AccountDeleteHandler] Reauth result:", reauthSuccess);
  }

  if (!reauthSuccess) {
    throw new Error("Reauthentication required to delete account");
  }

  if (__DEV__) {
    console.log("[AccountDeleteHandler] Retrying deletion after reauth");
  }

  const result = await deleteCurrentUser({ autoReauthenticate: false });

  if (__DEV__) {
    console.log("[AccountDeleteHandler] Reauth retry result:", result);
  }

  if (result.success) {
    if (__DEV__) {
      console.log("[AccountDeleteHandler] Delete successful after reauth");
    }
    return;
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
}
