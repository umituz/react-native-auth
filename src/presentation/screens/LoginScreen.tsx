/**
 * Login Screen
 * Beautiful, production-ready login screen with email/password and guest mode
 */

import React from "react";
import { useAppNavigation, AtomicCard, ScreenLayout, useAppDesignTokens } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { AuthHeader } from "../components/AuthHeader";
import { LoginForm } from "../components/LoginForm";

export const LoginScreen: React.FC = () => {
  const { t } = useLocalization();
  const navigation = useAppNavigation();
  const tokens = useAppDesignTokens();

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <ScreenLayout
      scrollable
      keyboardAvoiding
      maxWidth={440}
      contentContainerStyle={{ justifyContent: "center" }}
      backgroundColor={tokens.colors.backgroundPrimary}
    >
      <AuthHeader title={t("auth.title")} />
      <AtomicCard variant="elevated" padding="lg">
        <LoginForm onNavigateToRegister={handleNavigateToRegister} />
      </AtomicCard>
    </ScreenLayout>
  );
};

