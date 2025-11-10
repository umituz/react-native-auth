/**
 * Auth Legal Links Component
 * Display Terms of Service and Privacy Policy links
 */

import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { AtomicButton, AtomicText } from "@umituz/react-native-design-system";
import { useAppDesignTokens } from "@umituz/react-native-theme";
import { useLocalization } from "@umituz/react-native-localization";

export interface AuthLegalLinksProps {
  /**
   * Terms of Service URL
   */
  termsUrl?: string;
  /**
   * Privacy Policy URL
   */
  privacyUrl?: string;
  /**
   * Callback when Terms of Service is pressed
   */
  onTermsPress?: () => void;
  /**
   * Callback when Privacy Policy is pressed
   */
  onPrivacyPress?: () => void;
  /**
   * Custom text before links
   */
  prefixText?: string;
}

export const AuthLegalLinks: React.FC<AuthLegalLinksProps> = ({
  termsUrl,
  privacyUrl,
  onTermsPress,
  onPrivacyPress,
  prefixText,
}) => {
  const tokens = useAppDesignTokens();
  const { t } = useLocalization();

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

  const hasTerms = termsUrl || onTermsPress;
  const hasPrivacy = privacyUrl || onPrivacyPress;

  if (!hasTerms && !hasPrivacy) {
    return null;
  }

  return (
    <View style={styles.container}>
      {prefixText && (
        <AtomicText
          type="bodySmall"
          color="secondary"
          style={styles.prefixText}
        >
          {prefixText}
        </AtomicText>
      )}
      <View style={styles.linksContainer}>
        {hasTerms && (
          <AtomicButton
            variant="text"
            onPress={handleTermsPress}
            style={styles.linkButton}
          >
            <AtomicText type="bodySmall" color="primary">
              {t("auth.termsOfService") || "Terms of Service"}
            </AtomicText>
          </AtomicButton>
        )}
        {hasTerms && hasPrivacy && (
          <AtomicText type="bodySmall" color="secondary" style={styles.separator}>
            {" • "}
          </AtomicText>
        )}
        {hasPrivacy && (
          <AtomicButton
            variant="text"
            onPress={handlePrivacyPress}
            style={styles.linkButton}
          >
            <AtomicText type="bodySmall" color="primary">
              {t("auth.privacyPolicy") || "Privacy Policy"}
            </AtomicText>
          </AtomicButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
  },
  prefixText: {
    marginBottom: 8,
    textAlign: "center",
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  linkButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  separator: {
    marginHorizontal: 4,
  },
});

