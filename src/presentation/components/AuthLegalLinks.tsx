import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { AtomicText, AtomicButton, useAppDesignTokens } from "@umituz/react-native-design-system";

export interface AuthLegalLinksTranslations {
  termsOfService: string;
  privacyPolicy: string;
}

interface AuthLegalLinksProps {
  translations: AuthLegalLinksTranslations;
  termsUrl?: string;
  privacyUrl?: string;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  prefixText?: string;
}

export const AuthLegalLinks: React.FC<AuthLegalLinksProps> = ({
  translations,
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
  prefixText,
}) => {
  const tokens = useAppDesignTokens();

  const handleTermsPress = async () => {
    if (onTermsPress) {
      onTermsPress();
    } else if (termsUrl) {
      await Linking.openURL(termsUrl);
    }
  };

  const handlePrivacyPress = async () => {
    if (onPrivacyPress) {
      onPrivacyPress();
    } else if (privacyUrl) {
      await Linking.openURL(privacyUrl);
    }
  };

  if (!termsUrl && !privacyUrl && !onTermsPress && !onPrivacyPress) {
    return null;
  }

  return (
    <View style={[styles.container, { marginTop: tokens.spacing.lg }]}>
      {prefixText && (
        <AtomicText type="bodySmall" color="textSecondary" style={styles.prefix}>
          {prefixText}
        </AtomicText>
      )}
      <View style={styles.linksRow}>
        {(termsUrl || onTermsPress) && (
          <AtomicButton
            variant="text"
            size="sm"
            onPress={() => { void handleTermsPress(); }}
          >
            {translations.termsOfService}
          </AtomicButton>
        )}
        {(termsUrl || onTermsPress) && (privacyUrl || onPrivacyPress) && (
          <AtomicText type="bodySmall" color="textSecondary"> & </AtomicText>
        )}
        {(privacyUrl || onPrivacyPress) && (
          <AtomicButton
            variant="text"
            size="sm"
            onPress={() => { void handlePrivacyPress(); }}
          >
            {translations.privacyPolicy}
          </AtomicButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  prefix: {
    marginBottom: 4,
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
