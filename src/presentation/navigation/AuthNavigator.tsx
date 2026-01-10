/**
 * Auth Navigator
 * Stack navigator for authentication screens (Login, Register)
 */

import React, { useEffect, useState } from "react";
import {
  StackNavigator,
  useAppDesignTokens,
  storageRepository,
  unwrap,
  type StackNavigatorConfig,
  type StackScreenProps,
} from "@umituz/react-native-design-system";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const SHOW_REGISTER_KEY = "auth_show_register";

export interface AuthNavigatorProps {
  /**
   * Terms of Service URL
   */
  termsUrl?: string;
  /**
   * Privacy Policy URL
   */
  privacyUrl?: string;
  /**
   * Callback when Terms of Service is pressed
   */
  onTermsPress?: () => void;
  /**
   * Callback when Privacy Policy is pressed
   */
  onPrivacyPress?: () => void;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = ({
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

  if (initialRouteName === undefined) {
    return null;
  }

  const RegisterScreenWrapper = (
    props: StackScreenProps<AuthStackParamList, "Register">
  ) => (
    <RegisterScreen
      {...props}
      termsUrl={termsUrl}
      privacyUrl={privacyUrl}
      onTermsPress={onTermsPress}
      onPrivacyPress={onPrivacyPress}
    />
  );

  const stackConfig: StackNavigatorConfig<AuthStackParamList> = {
    initialRouteName,
    screenOptions: {
      headerShown: false,
      cardStyle: { backgroundColor: tokens.colors.backgroundPrimary },
    },
    screens: [
      { name: "Login", component: LoginScreen },
      { name: "Register", component: RegisterScreenWrapper },
    ],
  };

  return <StackNavigator config={stackConfig} />;
};


