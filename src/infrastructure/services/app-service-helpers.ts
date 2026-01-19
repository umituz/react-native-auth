/**
 * App Service Helpers
 * Creates ready-to-use auth service for configureAppServices
 */

import { useAuthStore, selectIsAuthenticated, selectUserId } from "../../presentation/stores/authStore";
import { useAuthModalStore } from "../../presentation/stores/authModalStore";

export interface IAuthService {
  getUserId: () => string | null;
  isAuthenticated: () => boolean;
  requireAuth: () => string;
}

/**
 * Creates an auth service implementation for configureAppServices
 */
export function createAuthService(): IAuthService {
  return {
    getUserId: () => selectUserId(useAuthStore.getState()),
    isAuthenticated: () => selectIsAuthenticated(useAuthStore.getState()),
    requireAuth: () => {
      if (!selectIsAuthenticated(useAuthStore.getState())) {
        useAuthModalStore.getState().showAuthModal();
        throw new Error("Auth required");
      }
      return selectUserId(useAuthStore.getState()) ?? "";
    },
  };
}
