/**
 * Login Screen Component
 * Login form screen with navigation
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 */

import React, { memo, useCallback } from "react";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicCard } from "@umituz/react-native-design-system/atoms";
import { useAppNavigation } from "@umituz/react-native-design-system/molecules";
import { ScreenLayout } from "@umituz/react-native-design-system/layouts";
import { useResponsive } from "@umituz/react-native-design-system/responsive";
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

export const LoginScreen = memo<LoginScreenProps>(({ translations }) => {
  const navigation = useAppNavigation();
  const tokens = useAppDesignTokens();
  const responsive = useResponsive();

  // PERFORMANCE: Stable callback reference
  const handleNavigateToRegister = useCallback(() => {
    navigation.navigate("Register");
  }, [navigation]);

  return (
    <ScreenLayout
      scrollable
      keyboardAvoiding
      maxWidth={responsive.maxContentWidth}
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
});

LoginScreen.displayName = 'LoginScreen';
