/**
 * Anonymous Sign-In Handler
 * Handles anonymous authentication retry logic with timeout protection
 */

import { anonymousAuthService } from "@umituz/react-native-firebase";
import type { Auth } from "firebase/auth";
import type { User } from "firebase/auth";

const MAX_ANONYMOUS_RETRIES = 2;
const ANONYMOUS_RETRY_DELAY_MS = 1000;
const ANONYMOUS_SIGNIN_TIMEOUT_MS = 10000;

interface AnonymousSignInCallbacks {
    onSignInStart: () => void;
    onSignInSuccess: () => void;
    onSignInFailure: (error: Error) => void;
}

interface AnonymousSignInOptions {
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
}

/**
 * Attempt anonymous sign-in with retry logic and timeout protection
 * @param auth - Firebase Auth instance
 * @param callbacks - Callback functions for sign-in events
 * @param options - Configuration options
 */
async function attemptAnonymousSignIn(
    auth: Auth,
    callbacks: AnonymousSignInCallbacks,
    options: AnonymousSignInOptions = {}
): Promise<void> {
    const {
        maxRetries = MAX_ANONYMOUS_RETRIES,
        retryDelay = ANONYMOUS_RETRY_DELAY_MS,
        timeout = ANONYMOUS_SIGNIN_TIMEOUT_MS,
    } = options;

    callbacks.onSignInStart();

    try {
        // Add timeout protection
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Anonymous sign-in timeout")), timeout)
        );

        // Race between sign-in and timeout
        await Promise.race([
            performAnonymousSignIn(auth, maxRetries, retryDelay),
            timeoutPromise,
        ]);

        callbacks.onSignInSuccess();
    } catch (error) {
        const signInError = error instanceof Error ? error : new Error("Unknown sign-in error");
        callbacks.onSignInFailure(signInError);
    }
}

/**
 * Perform anonymous sign-in with retry logic
 */
async function performAnonymousSignIn(
    auth: Auth,
    maxRetries: number,
    retryDelay: number
): Promise<void> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            await anonymousAuthService.signInAnonymously(auth);
            return;
        } catch (error) {
            // If not last attempt, wait and retry
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(() => resolve(undefined), retryDelay));
                continue;
            }

            // All attempts failed
            throw error;
        }
    }
}

/**
 * Create anonymous sign-in handler for auth listener
 * Returns a function that can be called when no user is detected
 */
export function createAnonymousSignInHandler(
    auth: Auth | null,
    store: {
        setFirebaseUser: (user: User | null) => void;
        setLoading: (loading: boolean) => void;
        setInitialized: (initialized: boolean) => void;
        setError: (error: string | null) => void;
    }
): () => Promise<void> {
    return async () => {
        if (!auth) {
            store.setFirebaseUser(null);
            store.setLoading(false);
            store.setInitialized(true);
            return;
        }

        store.setLoading(true);

        await attemptAnonymousSignIn(
            auth,
            {
                onSignInStart: () => {
                    // Sign-in starting
                },
                onSignInSuccess: () => {
                    // Listener will be triggered again with the new user
                },
                onSignInFailure: (error: Error) => {
                    if (__DEV__) {
                        console.error("[AnonymousSignIn] Failed:", error.message);
                    }
                    store.setFirebaseUser(null);
                    store.setLoading(false);
                    store.setInitialized(true);
                    store.setError("Failed to sign in anonymously. Please check your connection.");
                },
            },
            {
                maxRetries: MAX_ANONYMOUS_RETRIES,
                retryDelay: ANONYMOUS_RETRY_DELAY_MS,
                timeout: ANONYMOUS_SIGNIN_TIMEOUT_MS,
            }
        );
    };
}
