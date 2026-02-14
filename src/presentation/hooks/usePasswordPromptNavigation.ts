import { useCallback } from 'react';
import { CommonActions } from '@react-navigation/native';
import { AppNavigation } from '@umituz/react-native-design-system';
import { setPasswordPromptCallback } from '../utils/passwordPromptCallback';

declare const __DEV__: boolean;

export interface UsePasswordPromptNavigationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface UsePasswordPromptNavigationReturn {
  showPasswordPrompt: () => Promise<string | null>;
}

export const usePasswordPromptNavigation = (
  options: UsePasswordPromptNavigationOptions
): UsePasswordPromptNavigationReturn => {
  const { title, message, confirmText, cancelText } = options;

  const showPasswordPrompt = useCallback((): Promise<string | null> => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[showPasswordPrompt] Called");
    }

    return new Promise<string | null>((resolve) => {
      setPasswordPromptCallback(resolve);

      try {
        const ref = AppNavigation.getRef();
        if (!ref?.isReady()) {
          throw new Error("Navigation not ready");
        }

        ref.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Home' },
              { name: 'PasswordPrompt', params: { title, message, confirmText, cancelText } },
            ],
          })
        );

        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log("[showPasswordPrompt] Navigation reset to PasswordPrompt");
        }
      } catch (error) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.error("[showPasswordPrompt] Navigation failed:", error);
        }
        setPasswordPromptCallback(null);
        resolve(null);
      }
    });
  }, [title, message, confirmText, cancelText]);

  return { showPasswordPrompt };
};
