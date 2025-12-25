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

export class AuthRepository implements IAuthRepository {
    private provider: IAuthProvider;
    private config: AuthConfig;

    constructor(provider: IAuthProvider, config: AuthConfig) {
        this.provider = provider;
        this.config = config;
    }

    async signUp(params: SignUpParams): Promise<AuthUser> {
        // Validate email
        const emailResult = validateEmail(params.email);
        if (!emailResult.isValid) {
            throw new AuthInvalidEmailError(emailResult.error);
        }

        // Validate display name if provided
        if (params.displayName) {
            const nameResult = validateDisplayName(params.displayName);
            if (!nameResult.isValid) {
                throw new AuthValidationError(nameResult.error || "Invalid name", "displayName");
            }
        }

        // Validate password strength for registration
        const passwordResult = validatePasswordForRegister(params.password, this.config.password);
        if (!passwordResult.isValid) {
            throw new AuthWeakPasswordError(passwordResult.error);
        }

        return this.provider.signUp({
            email: params.email,
            password: params.password,
            displayName: params.displayName,
        });
    }

    async signIn(params: SignInParams): Promise<AuthUser> {
        // Validate email format
        const emailResult = validateEmail(params.email);
        if (!emailResult.isValid) {
            throw new AuthInvalidEmailError(emailResult.error);
        }

        // For login, only check if password is provided (no strength requirements)
        const passwordResult = validatePasswordForLogin(params.password);
        if (!passwordResult.isValid) {
            throw new AuthValidationError(passwordResult.error || "Password is required", "password");
        }

        return this.provider.signIn({
            email: params.email,
            password: params.password,
        });
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
