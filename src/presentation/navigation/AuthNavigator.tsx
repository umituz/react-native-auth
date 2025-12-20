/**
 * Auth Navigator
 * Stack navigator for authentication screens (Login, Register)
 */

import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
import { storageRepository } from "@umituz/react-native-storage";
import { unwrap } from "@umituz/react-native-storage";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const AuthStack = createStackNavigator();

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
    storageRepository.getString(SHOW_REGISTER_KEY, "false").then((result) => {
      const value = unwrap(result, "false");
      if (value === "true") {
        setInitialRouteName("Register");
        storageRepository.removeItem(SHOW_REGISTER_KEY);
      } else {
        setInitialRouteName("Login");
      }
    });
  }, []);

  if (initialRouteName === undefined) {
    return null;
  }

  return (
    <AuthStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: tokens.colors.backgroundPrimary },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register">
        {(props: any) => (
          <RegisterScreen
            {...props}
            termsUrl={termsUrl}
            privacyUrl={privacyUrl}
            onTermsPress={onTermsPress}
            onPrivacyPress={onPrivacyPress}
          />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
};

