/**
 * Auth Mutations
 * TanStack Query mutations for auth operations
 */

import { useMutation } from "@umituz/react-native-design-system";
import { getAuthService } from "../../../infrastructure/services/AuthService";
import type { AuthCredentials, SignUpCredentials } from "../../../application/ports/IAuthProvider";
import type { AuthUser } from "../../../domain/entities/AuthUser";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: async (params: SignUpCredentials): Promise<AuthUser> => {
            const service = getAuthService();
            if (!service) throw new Error("Auth Service not initialized");
            return service.signUp(params);
        },
    });
};

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: async (params: AuthCredentials): Promise<AuthUser> => {
            const service = getAuthService();
            if (!service) throw new Error("Auth Service not initialized");
            return service.signIn(params);
        },
    });
};

export const useSignOutMutation = () => {
    return useMutation({
        mutationFn: async (): Promise<void> => {
            const service = getAuthService();
            if (!service) throw new Error("Auth Service not initialized");
            return service.signOut();
        },
    });
};

export const useAnonymousModeMutation = () => {
    return useMutation({
        mutationFn: async (): Promise<void> => {
            const service = getAuthService();
            if (!service) throw new Error("Auth Service not initialized");
            return service.setAnonymousMode();
        },
    });
};
