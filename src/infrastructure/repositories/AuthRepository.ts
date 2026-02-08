/**
 * Auth Repository
 * Implementation of the Auth Repository Port
 * Handles data access for authentication
 */

import type { IAuthRepository } from "../../application/ports/IAuthRepository";
import type { IAuthProvider } from "../../application/ports/IAuthProvider";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { SignUpParams, SignInParams } from "../../application/ports/IAuthService";
import {
    AuthValidationError,
    AuthWeakPasswordError,
    AuthInvalidEmailError,
} from "../../domain/errors/AuthError";
import {
    validateEmail,
    validatePasswordForLogin,
    validatePasswordForRegister,
    validateDisplayName,
} from "../utils/AuthValidation";
import type { AuthConfig } from "../../domain/value-objects/AuthConfig";
import { sanitizeEmail, sanitizeName, sanitizePassword } from "../utils/validation/sanitization";

export class AuthRepository implements IAuthRepository {
    private provider: IAuthProvider;
    private config: AuthConfig;

    constructor(provider: IAuthProvider, config: AuthConfig) {
        this.provider = provider;
        this.config = config;
    }

    async signUp(params: SignUpParams): Promise<AuthUser> {
        const email = sanitizeEmail(params.email);
        const password = sanitizePassword(params.password);
        const displayName = params.displayName ? sanitizeName(params.displayName) : undefined;

        // Log if display name was sanitized
        if (__DEV__ && params.displayName && displayName && params.displayName !== displayName) {
            console.warn("[AuthRepository] Display name was sanitized during sign up. Original:", params.displayName, "Sanitized:", displayName);
        }

        // Validate email
        const emailResult = validateEmail(email);
        if (!emailResult.isValid) {
            throw new AuthInvalidEmailError(emailResult.error);
        }

        // Validate display name if provided
        if (displayName) {
            const nameResult = validateDisplayName(displayName);
            if (!nameResult.isValid) {
                throw new AuthValidationError(nameResult.error || "Invalid name", "displayName");
            }
        }

        // Validate password strength for registration
        const passwordResult = validatePasswordForRegister(password, this.config.password);
        if (!passwordResult.isValid) {
            throw new AuthWeakPasswordError(passwordResult.error);
        }

        return this.provider.signUp({ email, password, displayName });
    }

    async signIn(params: SignInParams): Promise<AuthUser> {
        const email = sanitizeEmail(params.email);
        const password = sanitizePassword(params.password);

        // Validate email format
        const emailResult = validateEmail(email);
        if (!emailResult.isValid) {
            throw new AuthInvalidEmailError(emailResult.error);
        }

        // For login, only check if password is provided (no strength requirements)
        const passwordResult = validatePasswordForLogin(password);
        if (!passwordResult.isValid) {
            throw new AuthValidationError(passwordResult.error || "Password is required", "password");
        }

        return this.provider.signIn({ email, password });
    }

    async signOut(): Promise<void> {
        await this.provider.signOut();
    }

    getCurrentUser(): AuthUser | null {
        return this.provider.getCurrentUser();
    }

    onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
        return this.provider.onAuthStateChange(callback);
    }
}
