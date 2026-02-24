import { useCallback } from 'react';
import { CommonActions } from '@react-navigation/native';
import { AppNavigation } from '@umituz/react-native-design-system/molecules';
import { setPasswordPromptCallback } from '../utils/passwordPromptCallback';

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
      } catch {
        setPasswordPromptCallback(null);
        resolve(null);
      }
    });
  }, [title, message, confirmText, cancelText]);

  return { showPasswordPrompt };
};
