/**
 * Anonymous Mode Handler
 * Handles anonymous sign-in flow
 */

import type { Auth } from "firebase/auth";
import type { AuthActions } from "../../../types/auth-store.types";
import { createAnonymousSignInHandler } from "./anonymousSignInHandler";
import {
  startAnonymousSignIn,
  completeAnonymousSignIn,
} from "./listenerState.util";

type Store = AuthActions & { isAnonymous: boolean };

/**
 * Handle anonymous mode sign-in
 */
export async function handleAnonymousMode(store: Store, auth: Auth): Promise<void> {
  if (!startAnonymousSignIn()) {
    return; // Already signing in
  }

  const handleAnonymousSignIn = createAnonymousSignInHandler(auth, store);

  try {
    await handleAnonymousSignIn();
  } finally {
    completeAnonymousSignIn();
  }
}
