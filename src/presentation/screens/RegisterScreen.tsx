/**
 * Register Screen
 * Beautiful, production-ready registration screen with validation
 */

import React from "react";
import { useAppNavigation, AtomicCard } from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import type { AuthStackParamList } from "../navigation/AuthNavigator";
import { AuthContainer } from "../components/AuthContainer";
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
  const navigation = useAppNavigation<AuthStackParamList>();

  const handleNavigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <AuthContainer>
      <AuthHeader title={t("auth.createAccount")} />
      <AtomicCard variant="elevated" padding="large">
        <RegisterForm
          onNavigateToLogin={handleNavigateToLogin}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          onTermsPress={onTermsPress}
          onPrivacyPress={onPrivacyPress}
        />
      </AtomicCard>
    </AuthContainer>
  );
};

