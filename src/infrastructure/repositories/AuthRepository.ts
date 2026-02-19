/**
 * Auth Repository
 * Handles authentication with validation
 */

import type { IAuthRepository } from "../../application/ports/IAuthRepository";
import type { AuthUser } from "../../domain/entities/AuthUser";
import {
    signInWithEmail,
    signUpWithEmail,
    signOut as firebaseSignOut,
    getCurrentUserFromGlobal,
    setupAuthListener,
    ensureUserDocument,
} from "@umituz/react-native-firebase";
import {
    AuthValidationError,
    AuthWeakPasswordError,
    AuthInvalidEmailError,
    AuthError,
} from "../../domain/errors/AuthError";
import {
    validateEmail,
    validatePasswordForLogin,
    validatePasswordForRegister,
    validateDisplayName,
} from "../utils/AuthValidation";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import { sanitizeEmail, sanitizeName, sanitizePassword } from "../utils/validation/sanitization";
import { mapToAuthUser } from "../utils/UserMapper";

export interface SignUpCredentials {
    email: string;
    password: string;
    displayName?: string;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export class AuthRepository implements IAuthRepository {
    private config: AuthConfig;

    constructor(config: AuthConfig) {
        this.config = config;
    }

    async signUp(params: SignUpCredentials): Promise<AuthUser> {
        const email = sanitizeEmail(params.email);
        const password = sanitizePassword(params.password);
        const displayName = params.displayName ? sanitizeName(params.displayName) : undefined;

        const emailResult = validateEmail(email);
        if (!emailResult.isValid) {
            throw new AuthInvalidEmailError(emailResult.error);
        }

        if (displayName) {
            const nameResult = validateDisplayName(displayName);
            if (!nameResult.isValid) {
                throw new AuthValidationError(nameResult.error || "Invalid name", "displayName");
            }
        }

        const passwordResult = validatePasswordForRegister(password, this.config.password);
        if (!passwordResult.isValid) {
            throw new AuthWeakPasswordError(passwordResult.error);
        }

        const result = await signUpWithEmail({ email, password, displayName });
        if (!result.success || !result.data) {
            throw new AuthError(result.error?.message || "Sign up failed");
        }

        const authUser = mapToAuthUser(result.data);
        if (!authUser) {
            throw new AuthError("Failed to map user");
        }

        // Create Firestore user document for new users
        await ensureUserDocument(result.data, { signUpMethod: "email" });

        return authUser;
    }

    async signIn(params: AuthCredentials): Promise<AuthUser> {
        const email = sanitizeEmail(params.email);
        const password = sanitizePassword(params.password);

        const emailResult = validateEmail(email);
        if (!emailResult.isValid) {
            throw new AuthInvalidEmailError(emailResult.error);
        }

        const passwordResult = validatePasswordForLogin(password);
        if (!passwordResult.isValid) {
            throw new AuthValidationError(passwordResult.error || "Password is required", "password");
        }

        const result = await signInWithEmail(email, password);
        if (!result.success || !result.data) {
            throw new AuthError(result.error?.message || "Sign in failed");
        }

        const authUser = mapToAuthUser(result.data);
        if (!authUser) {
            throw new AuthError("Failed to map user");
        }

        // Ensure Firestore user document exists for existing users too
        await ensureUserDocument(result.data, { signUpMethod: "email" });

        return authUser;
    }

    async signOut(): Promise<void> {
        const result = await firebaseSignOut();
        if (!result.success) {
            throw new AuthError(result.error?.message || "Sign out failed");
        }
    }

    getCurrentUser(): AuthUser | null {
        const user = getCurrentUserFromGlobal();
        return user ? mapToAuthUser(user) : null;
    }

    onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
        const result = setupAuthListener({
            onAuthStateChange: (user) => {
                const authUser = user ? mapToAuthUser(user) : null;
                callback(authUser);
            },
        });
        return result.success && result.unsubscribe ? result.unsubscribe : () => {};
    }
}
