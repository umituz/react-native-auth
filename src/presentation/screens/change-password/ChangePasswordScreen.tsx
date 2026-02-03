/**
 * Change Password Screen
 */

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  ScreenLayout,
  ScreenHeader,
  AtomicInput,
  AtomicButton,
  AtomicText,
  useAppDesignTokens,
} from "@umituz/react-native-design-system";
import {
  updateUserPassword,
  reauthenticateWithPassword,
  getCurrentUserFromGlobal,
} from "@umituz/react-native-firebase";
import { RequirementItem } from "./RequirementItem";
import { validatePassword } from "./ChangePasswordScreen.types";
import type { ChangePasswordScreenProps } from "./ChangePasswordScreen.types";

export type { ChangePasswordTranslations, ChangePasswordScreenProps } from "./ChangePasswordScreen.types";

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  translations,
  onSuccess,
  onCancel,
}) => {
  const tokens = useAppDesignTokens();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validation = validatePassword(newPassword, confirmPassword, currentPassword);

  const handleChangePassword = async () => {
    if (!validation.isValid) {
      Alert.alert("Error", translations.fillAllFields);
      return;
    }

    const user = getCurrentUserFromGlobal();
    if (!user) {
      setError(translations.unauthorized);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reauthResult = await reauthenticateWithPassword(user, currentPassword);
      if (!reauthResult.success) {
        setError(reauthResult.error?.message || translations.signInFailed);
        setLoading(false);
        return;
      }

      const updateResult = await updateUserPassword(user, newPassword);
      if (updateResult.success) {
        Alert.alert("Success", translations.success, [
          { text: "OK", onPress: onSuccess }
        ]);
      } else {
        setError(updateResult.error?.message || translations.error);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : translations.error;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout
      scrollable
      header={<ScreenHeader title={translations.title} />}
      backgroundColor={tokens.colors.backgroundPrimary}
      edges={["bottom"]}
    >
      <View style={styles.content}>
        <AtomicText type="bodyMedium" style={{ color: tokens.colors.textSecondary, marginBottom: 24 }}>
          {translations.description}
        </AtomicText>

        <View style={styles.form}>
          <AtomicInput
            label={translations.currentPassword}
            placeholder={translations.enterCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            showPasswordToggle
            variant="filled"
          />

          <AtomicInput
            label={translations.newPassword}
            placeholder={translations.enterNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            showPasswordToggle
            variant="filled"
          />

          <AtomicInput
            label={translations.confirmPassword}
            placeholder={translations.enterConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            showPasswordToggle
            variant="filled"
          />

          <View style={[styles.requirementsContainer, { backgroundColor: tokens.colors.surfaceSecondary }]}>
            <AtomicText type="labelMedium" style={{ color: tokens.colors.textSecondary, marginBottom: 8 }}>
              {translations.requirements}
            </AtomicText>
            <RequirementItem label={translations.minLength} met={validation.isLengthValid} />
            <RequirementItem label={translations.uppercase} met={validation.hasUppercase} />
            <RequirementItem label={translations.lowercase} met={validation.hasLowercase} />
            <RequirementItem label={translations.number} met={validation.hasNumber} />
            <RequirementItem label={translations.specialChar} met={validation.hasSpecialChar} />
            <RequirementItem label={translations.passwordsMatch} met={validation.passwordsMatch} />
          </View>

          {error && (
            <AtomicText style={{ color: tokens.colors.error, marginTop: 16 }}>
              {error}
            </AtomicText>
          )}

          <View style={styles.actions}>
            <AtomicButton
              title={translations.cancel}
              onPress={onCancel || (() => {})}
              variant="outline"
              style={{ flex: 1 }}
            />
            <AtomicButton
              title={loading ? translations.changing : translations.changePassword}
              onPress={() => { void handleChangePassword(); }}
              loading={loading}
              disabled={!validation.isValid || loading}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  form: {
    gap: 16,
  },
  requirementsContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
});
