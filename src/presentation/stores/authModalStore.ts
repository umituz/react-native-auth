/**
 * Auth Modal Store
 * Zustand store for managing auth modal visibility globally
 *
 * Usage:
 * ```tsx
 * import { useAuthModalStore } from '@umituz/react-native-auth';
 *
 * // Show auth modal with callback
 * const { showAuthModal } = useAuthModalStore();
 * showAuthModal(() => {
 *   // Executed after successful login
 * });
 *
 * // In app root, render AuthBottomSheet
 * <AuthBottomSheet />
 * ```
 */

import { createStore } from "@umituz/react-native-design-system/storage";

type AuthModalMode = "login" | "register";

interface AuthModalState {
  isVisible: boolean;
  mode: AuthModalMode;
  pendingCallback: (() => void | Promise<void>) | null;
}

interface AuthModalActions {
  showAuthModal: (
    callback?: () => void | Promise<void>,
    mode?: AuthModalMode,
  ) => void;
  hideAuthModal: () => void;
  setMode: (mode: AuthModalMode) => void;
  executePendingCallback: () => void;
  clearPendingCallback: () => void;
}

const initialAuthModalState: AuthModalState = {
  isVisible: false,
  mode: "login",
  pendingCallback: null,
};

export const useAuthModalStore = createStore<AuthModalState, AuthModalActions>({
  name: "auth-modal-store",
  initialState: initialAuthModalState,
  persist: false,
  actions: (set, get) => ({
    showAuthModal: (
      callback?: () => void | Promise<void>,
      mode: AuthModalMode = "login",
    ) => {
      set({
        isVisible: true,
        mode,
        pendingCallback: callback || null,
      });
    },

    hideAuthModal: () => {
      // Clear pending callback to prevent memory leaks
      set({ isVisible: false, pendingCallback: null });
    },

    setMode: (mode: AuthModalMode) => {
      set({ mode });
    },

    executePendingCallback: () => {
      const state = get();
      if (state.pendingCallback) {
        // Wrap in try-catch to handle promise rejections
        try {
          const result = state.pendingCallback();
          // If it's a promise, catch rejections
          if (result && typeof result.then === 'function') {
            result.catch((error) => {
              console.error('[AuthModalStore] Pending callback error:', error);
            });
          }
        } catch (error) {
          console.error('[AuthModalStore] Pending callback error:', error);
        }
        set({ pendingCallback: null });
      }
    },

    clearPendingCallback: () => {
      set({ pendingCallback: null });
    },
  }),
});
