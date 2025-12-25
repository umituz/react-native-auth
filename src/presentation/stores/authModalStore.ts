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

import { create } from "zustand";

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

type AuthModalStore = AuthModalState & AuthModalActions;

export const useAuthModalStore = create<AuthModalStore>((set, get) => ({
  isVisible: false,
  mode: "login",
  pendingCallback: null,

  showAuthModal: (callback, mode = "login" as AuthModalMode) => {
    set({
      isVisible: true,
      mode,
      pendingCallback: callback || null,
    });
  },

  hideAuthModal: () => {
    set({ isVisible: false });
  },

  setMode: (mode) => {
    set({ mode });
  },

  executePendingCallback: () => {
    const { pendingCallback } = get();
    if (pendingCallback) {
      void pendingCallback();
      set({ pendingCallback: null });
    }
  },


  clearPendingCallback: () => {
    set({ pendingCallback: null });
  },
}));
