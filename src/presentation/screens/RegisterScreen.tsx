import React from "react";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicCard } from "@umituz/react-native-design-system/atoms";
import { useAppNavigation } from "@umituz/react-native-design-system/molecules";
import { ScreenLayout } from "@umituz/react-native-design-system/layouts";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm, type RegisterFormTranslations } from "../components/RegisterForm";

export interface RegisterScreenTranslations {
  title: string;
  subtitle?: string;
  form: RegisterFormTranslations;
}

export interface RegisterScreenProps {
  translations: RegisterScreenTranslations;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  translations,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
}) => {
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
      <AuthHeader title={translations.title} subtitle={translations.subtitle} />
      <AtomicCard variant="elevated" padding="lg">
        <RegisterForm
          translations={translations.form}
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
