
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { SignUpParams, SignInParams } from "../ports/IAuthService";

export interface IAuthRepository {
    signUp(params: SignUpParams): Promise<AuthUser>;
    signIn(params: SignInParams): Promise<AuthUser>;
    signOut(): Promise<void>;
    getCurrentUser(): AuthUser | null;
    onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}
