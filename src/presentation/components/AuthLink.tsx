/**
 * Auth Link Component
 * Link text with button for navigation between auth screens
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AtomicButton } from "@umituz/react-native-design-system-atoms";
import { useAppDesignTokens } from "@umituz/react-native-design-system-theme";

interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
  text,
  linkText,
  onPress,
  disabled = false,
}) => {
  const tokens = useAppDesignTokens();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: tokens.colors.textSecondary || "#666666" },
        ]}
      >
        {text}{" "}
      </Text>
      <AtomicButton
        variant="text"
        onPress={onPress}
        disabled={disabled}
        style={styles.button}
      >
        {linkText}
      </AtomicButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: "400",
  },
  button: {
    paddingHorizontal: 4,
  },
});











