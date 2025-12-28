/**
 * Auth Mutations
 * TanStack Query mutations for auth operations
 */

import { useMutation } from "@umituz/react-native-tanstack";
import { getAuthService } from "../../../infrastructure/services/AuthService";
import type { SignUpParams, SignInParams } from "../../../application/ports/IAuthService";
import type { AuthUser } from "../../../domain/entities/AuthUser";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: async (params: SignUpParams): Promise<AuthUser> => {
            const service = getAuthService();
            if (!service) throw new Error("Auth Service not initialized");
            return service.signUp(params);
        },
    });
};

export const useSignInMutation = () => {
    return useMutation({
        mutationFn: async (params: SignInParams): Promise<AuthUser> => {
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

export const useGuestModeMutation = () => {
    return useMutation({
        mutationFn: async (): Promise<void> => {
            const service = getAuthService();
            if (!service) throw new Error("Auth Service not initialized");
            return service.setGuestMode();
        },
    });
};
