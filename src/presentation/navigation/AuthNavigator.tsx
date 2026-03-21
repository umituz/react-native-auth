import React, { useEffect, useMemo, useState } from "react";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { StackNavigator, type StackNavigatorConfig, type StackScreenProps } from "@umituz/react-native-design-system/molecules";
import { storageRepository, unwrap } from "@umituz/react-native-design-system/storage";
import type { SocialAuthConfiguration } from "../hooks/useAuthBottomSheet";
import { LoginScreen, type LoginScreenTranslations } from "../screens/LoginScreen";
import { RegisterScreen, type RegisterScreenTranslations } from "../screens/RegisterScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Storage key for persisting initial route preference across navigation
const SHOW_REGISTER_KEY = "auth_show_register";

export interface AuthNavigatorTranslations {
  login: LoginScreenTranslations;
  register: RegisterScreenTranslations;
}

export interface AuthNavigatorProps {
  translations: AuthNavigatorTranslations;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  socialConfig?: SocialAuthConfiguration;
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
  renderLogo?: () => React.ReactNode;
}

export const AuthNavigator: React.FC<AuthNavigatorProps> = (props) => {
  const { translations, termsUrl, privacyUrl, onTermsPress, onPrivacyPress, socialConfig, onGoogleSignIn, onAppleSignIn, renderLogo } = props;
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

  // Memoize social auth props
  const socialAuthProps = useMemo(() => ({
    socialConfig,
    onGoogleSignIn,
    onAppleSignIn,
    renderLogo,
  }), [socialConfig, onGoogleSignIn, onAppleSignIn, renderLogo]);

  // Create screen components with proper types
  const LoginScreenComponent = useMemo(() => {
    // Use FC with generic props to satisfy StackNavigator type, then cast for internal use
    const LoginScreenWrapper: React.FC<{ navigation: unknown; route: unknown }> = (props) => (
      <LoginScreen
        {...(props as StackScreenProps<AuthStackParamList, 'Login'>)}
        translations={loginTranslations}
        {...socialAuthProps}
      />
    );
    return React.memo(LoginScreenWrapper);
  }, [loginTranslations, socialAuthProps]);

  const RegisterScreenComponent = useMemo(() => {
    // Use FC with generic props to satisfy StackNavigator type, then cast for internal use
    const RegisterScreenWrapper: React.FC<{ navigation: unknown; route: unknown }> = (props) => (
      <RegisterScreen
        {...(props as StackScreenProps<AuthStackParamList, 'Register'>)}
        translations={registerTranslations}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
        onTermsPress={onTermsPress}
        onPrivacyPress={onPrivacyPress}
        {...socialAuthProps}
      />
    );
    return React.memo(RegisterScreenWrapper);
  }, [registerTranslations, termsUrl, privacyUrl, onTermsPress, onPrivacyPress, socialAuthProps]);

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
      { name: "Login", component: LoginScreenComponent },
      { name: "Register", component: RegisterScreenComponent },
    ],
  };

  return <StackNavigator config={stackConfig} />;
};


