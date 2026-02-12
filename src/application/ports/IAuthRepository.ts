
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { AuthCredentials, SignUpCredentials } from "../../infrastructure/repositories/AuthRepository";

export interface IAuthRepository {
    signUp(params: SignUpCredentials): Promise<AuthUser>;
    signIn(params: AuthCredentials): Promise<AuthUser>;
    signOut(): Promise<void>;
    getCurrentUser(): AuthUser | null;
    onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
