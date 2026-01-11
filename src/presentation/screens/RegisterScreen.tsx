/**
 * Register Screen
 * Beautiful, production-ready registration screen with validation
 */

import React from "react";
import { useAppNavigation, AtomicCard, ScreenLayout, useAppDesignTokens } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm } from "../components/RegisterForm";

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
  const navigation = useAppNavigation();
  const tokens = useAppDesignTokens();

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ScreenLayout
        scrollable
        keyboardAvoiding
        maxWidth={440}
        contentContainerStyle={{ justifyContent: "center" }}
        backgroundColor={tokens.colors.backgroundPrimary}
    >
      <AuthHeader title={t("auth.createAccount")} />
      <AtomicCard variant="elevated" padding="lg">
        <RegisterForm
          onNavigateToLogin={handleNavigateToLogin}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          onTermsPress={onTermsPress}
          onPrivacyPress={onPrivacyPress}
        />
      </AtomicCard>
    </ScreenLayout>
  );
};

