/**
 * Auth Navigator
 * Stack navigator for authentication screens (Login, Register)
 */

import React, { useEffect, useState } from "react";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
import { storageRepository } from "@umituz/react-native-storage";
import { unwrap } from "@umituz/react-native-storage";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

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
        {(props: StackScreenProps<AuthStackParamList, "Register">) => (
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


