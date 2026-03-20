import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { StackNavigator, type StackNavigatorConfig, type StackScreenProps } from "@umituz/react-native-design-system/molecules";
import { storageRepository, unwrap } from "@umituz/react-native-design-system/storage";
import { LoginScreen, type LoginScreenTranslations } from "../screens/LoginScreen";
import { RegisterScreen, type RegisterScreenTranslations } from "../screens/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const SHOW_REGISTER_KEY = "auth_show_register";

interface AuthNavigatorTranslations {
  login: LoginScreenTranslations;
  register: RegisterScreenTranslations;
}

interface AuthNavigatorProps {
  translations: AuthNavigatorTranslations;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({
  translations,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
  const tokens = useAppDesignTokens();
  const [initialRouteName, setInitialRouteName] = useState<
    "Login" | "Register" | undefined
  >(undefined);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const checkInitialRoute = async () => {
      try {
        const result = await storageRepository.getString(SHOW_REGISTER_KEY, "false");
        // Check if component is still mounted before updating state
        if (!isMounted || abortController.signal.aborted) return;

        const value = unwrap(result, "false");
        if (value === "true") {
          setInitialRouteName("Register");
          void storageRepository.removeItem(SHOW_REGISTER_KEY);
        } else {
          setInitialRouteName("Login");
        }
      } catch (error) {
        // Silently fail - will default to Login screen
        if (__DEV__) {
          console.error('[AuthNavigator] Failed to check initial route:', error);
        }
        if (isMounted && !abortController.signal.aborted) {
          setInitialRouteName("Login");
        }
      }
    };

    void checkInitialRoute();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Memoize nested translation objects to prevent screen wrapper recreation
  const loginTranslations = useMemo(() => translations.login, [translations.login]);
  const registerTranslations = useMemo(() => translations.register, [translations.register]);

  const LoginScreenWrapper = useCallback(
    (props: StackScreenProps<AuthStackParamList, 'Login'>) => (
      <LoginScreen
        {...props}
        translations={loginTranslations}
      />
    ),
    [loginTranslations]
  );

  const RegisterScreenWrapper = useCallback(
    (props: StackScreenProps<AuthStackParamList, 'Register'>) => (
      <RegisterScreen
        {...props}
        translations={registerTranslations}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
        onTermsPress={onTermsPress}
        onPrivacyPress={onPrivacyPress}
      />
    ),
    [registerTranslations, termsUrl, privacyUrl, onTermsPress, onPrivacyPress]
  );

  if (initialRouteName === undefined) {
    return null;
  }

  const stackConfig: StackNavigatorConfig<AuthStackParamList> = {
    initialRouteName,
    screenOptions: {
      headerShown: false,
      cardStyle: { backgroundColor: tokens.colors.backgroundPrimary },
    },
    screens: [
      { name: "Login", component: LoginScreenWrapper as React.ComponentType<any> },
      { name: "Register", component: RegisterScreenWrapper as React.ComponentType<any> },
    ],
  };

  return <StackNavigator config={stackConfig} />;
};


