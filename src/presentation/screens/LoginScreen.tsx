/**
 * Login Screen
 * Beautiful, production-ready login screen with email/password and guest mode
 */

import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useLocalization } from "@umituz/react-native-localization";
import type { AuthStackParamList } from "../navigation/AuthNavigator";
import type { StackNavigationProp } from "@react-navigation/stack";
import { AuthContainer } from "../components/AuthContainer";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFormCard } from "../components/AuthFormCard";
import { LoginForm } from "../components/LoginForm";

type LoginScreenNavigationProp = any;

export const LoginScreen: React.FC = () => {
  const { t } = useLocalization();
  const navigation = useNavigation();

  const handleNavigateToRegister = () => {
    navigation.navigate("Register" as any);
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
