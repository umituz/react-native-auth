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

import { createStore } from "@umituz/react-native-design-system";

export type AuthModalMode = "login" | "register";

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
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[authModalStore] showAuthModal called:", {
          mode,
          hasCallback: !!callback,
          currentVisible: get().isVisible,
        });
      }
      set({
        isVisible: true,
        mode,
        pendingCallback: callback || null,
      });
    },

    hideAuthModal: () => {
      set({ isVisible: false });
    },

    setMode: (mode: AuthModalMode) => {
      set({ mode });
    },

    executePendingCallback: () => {
      const state = get();
      if (state.pendingCallback) {
        void state.pendingCallback();
        set({ pendingCallback: null });
      }
    },

    clearPendingCallback: () => {
      set({ pendingCallback: null });
    },
  }),
});
