/**
 * App Service Helpers
 * Creates ready-to-use auth service for configureAppServices
 */

import { useAuthStore } from "../../presentation/stores/authStore";
import { selectIsAuthenticated, selectUserId } from "../../presentation/stores/auth.selectors";
import { useAuthModalStore } from "../../presentation/stores/authModalStore";

export interface IAppAuthServiceHelper {
  getUserId: () => string | null;
  isAuthenticated: () => boolean;
  requireAuth: () => string;
}

/**
 * Creates an auth service implementation for configureAppServices
 */
export function createAuthService(): IAppAuthServiceHelper {
  return {
    getUserId: () => selectUserId(useAuthStore.getState()),
    isAuthenticated: () => selectIsAuthenticated(useAuthStore.getState()),
    requireAuth: () => {
      if (!selectIsAuthenticated(useAuthStore.getState())) {
        useAuthModalStore.getState().showAuthModal();
        throw new Error("Auth required");
      }
      const userId = selectUserId(useAuthStore.getState());
      if (!userId) {
        throw new Error("User ID missing");
      }
      return userId;
    },
  };
}
