/**
 * Type declarations for external dependencies that might not have types
 * or where package resolution is failing in the current environment.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

declare module 'react-native-safe-area-context' {
  export function useSafeAreaInsets(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

declare module 'expo-linear-gradient' {
  export const LinearGradient: React.ComponentType<any>;
}

declare module '@react-navigation/stack' {
  export function createStackNavigator<T = any>(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
  export type StackNavigationProp<T = any> = any;
  export type StackScreenProps<T = any, K = any> = any;
}

declare module '@react-navigation/native' {
  export function useNavigation<T = any>(): T;
  export function useFocusEffect(effect: () => void | (() => void)): void;
  export type NavigationProp<T = any> = {
    navigate: (name: string, params?: any) => void;
    goBack: () => void;
    reset: (state: any) => void;
  };
}

declare module '@umituz/react-native-sentry' {
  export const trackPackageError: (error: any, context?: any) => void;
  export const addPackageBreadcrumb: (category: string, message: string, data?: any) => void;
}