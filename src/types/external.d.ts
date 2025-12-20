/**
 * Type declarations for external dependencies
 * These are optional dependencies that should be provided by the consuming application
 */

declare module '@umituz/react-native-design-system' {
  export function useAppDesignTokens(): any;
  export const defaultTheme: any;
}

declare module '@umituz/react-native-design-system' {
  export const AtomicInput: any;
  export const AtomicButton: any;
  export const AtomicText: any;
  export const AtomicView: any;
}

declare module '@umituz/react-native-localization' {
  export function useTranslation(): {
    t: (key: string, params?: Record<string, any>) => string;
  };
  export function useLocalization(): {
    t: (key: string, params?: Record<string, any>) => string;
  };
}

declare module '@umituz/react-native-firebase-auth' {
  export function useFirebaseAuth(): any;
}

declare module '@umituz/react-native-validation' {
  export function useValidation(): any;
  export function batchValidate(): any;
}

declare module '@umituz/react-native-storage' {
  export const storageRepository: {
    getString: (key: string, defaultValue?: string) => Promise<{ value: string } | null>;
    setString: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  export function unwrap(result: any, defaultValue: any): any;
}

declare module 'react-native-safe-area-context' {
  export function useSafeAreaInsets(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

declare module 'expo-linear-gradient' {
  import { ComponentType } from 'react';
  export const LinearGradient: ComponentType<any>;
}

declare module '@react-navigation/stack' {
  import { ComponentType } from 'react';
  export const createStackNavigator: any;
  export type StackNavigationProp<any> = any;
}

declare module '@react-navigation/native' {
  export function useNavigation(): any;
  export function useFocusEffect(effect: () => void | (() => void)): void;
}