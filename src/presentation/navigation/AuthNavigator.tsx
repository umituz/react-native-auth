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
    const checkInitialRoute = async () => {
      const result = await storageRepository.getString(SHOW_REGISTER_KEY, "false");
      const value = unwrap(result, "false");
      if (value === "true") {
        setInitialRouteName("Register");
        void storageRepository.removeItem(SHOW_REGISTER_KEY);
      } else {
        setInitialRouteName("Login");
      }
    };

    void checkInitialRoute();
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
      { name: "Login", component: LoginScreenWrapper },
      { name: "Register", component: RegisterScreenWrapper },
    ],
  };

  return <StackNavigator config={stackConfig} />;
};


