/**
 * Login Screen
 * Beautiful, production-ready login screen with email/password and guest mode
 */

import React from "react";
import { useAppNavigation } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import type { AuthStackParamList } from "../navigation/AuthNavigator";
import { AuthContainer } from "../components/AuthContainer";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFormCard } from "../components/AuthFormCard";
import { LoginForm } from "../components/LoginForm";

export const LoginScreen: React.FC = () => {
  const { t } = useLocalization();
  const navigation = useAppNavigation<AuthStackParamList>();

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <AuthContainer>
      <AuthHeader title={t("auth.title")} />
      <AuthFormCard>
        <LoginForm onNavigateToRegister={handleNavigateToRegister} />
      </AuthFormCard>
    </AuthContainer>
  );
};

