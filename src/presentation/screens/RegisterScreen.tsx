/**
 * Register Screen
 * Beautiful, production-ready registration screen with validation
 */

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useLocalization } from "@umituz/react-native-localization";
import type { AuthStackParamList } from "../navigation/AuthNavigator";
import type { StackNavigationProp } from "@react-navigation/stack";
import { AuthContainer } from "../components/AuthContainer";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFormCard } from "../components/AuthFormCard";
import { RegisterForm } from "../components/RegisterForm";

type RegisterScreenNavigationProp = any;

export interface RegisterScreenProps {
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
  const { t } = useLocalization();
  const navigation = useNavigation();

  const handleNavigateToLogin = () => {
    navigation.navigate("Login" as never);
  };

  return (
    <AuthContainer>
      <AuthHeader title={t("auth.createAccount")} />
      <AuthFormCard>
        <RegisterForm
          onNavigateToLogin={handleNavigateToLogin}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          onTermsPress={onTermsPress}
          onPrivacyPress={onPrivacyPress}
        />
      </AuthFormCard>
    </AuthContainer>
  );
};
