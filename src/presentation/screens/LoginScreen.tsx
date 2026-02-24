import React from "react";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicCard } from "@umituz/react-native-design-system/atoms";
import { useAppNavigation } from "@umituz/react-native-design-system/molecules";
import { ScreenLayout } from "@umituz/react-native-design-system/layouts";
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
