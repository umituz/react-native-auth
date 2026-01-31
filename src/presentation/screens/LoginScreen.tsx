import React from "react";
import { useAppNavigation, AtomicCard, ScreenLayout, useAppDesignTokens } from "@umituz/react-native-design-system";
import { AuthHeader } from "../components/AuthHeader";
import { LoginForm, type LoginFormTranslations } from "../components/LoginForm";

export interface LoginScreenTranslations {
  title: string;
  subtitle?: string;
  form: LoginFormTranslations;
}

export interface LoginScreenProps {
  translations: LoginScreenTranslations;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ translations }) => {
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
      <AuthHeader title={translations.title} subtitle={translations.subtitle} />
      <AtomicCard variant="elevated" padding="lg">
        <LoginForm
          translations={translations.form}
          onNavigateToRegister={handleNavigateToRegister}
        />
      </AtomicCard>
    </ScreenLayout>
  );
};
