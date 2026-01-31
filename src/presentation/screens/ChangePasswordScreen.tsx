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

export interface ChangePasswordTranslations {
  title: string;
  description: string;
  currentPassword: string;
  enterCurrentPassword: string;
  newPassword: string;
  enterNewPassword: string;
  confirmPassword: string;
  enterConfirmPassword: string;
  requirements: string;
  minLength: string;
  uppercase: string;
  lowercase: string;
  number: string;
  specialChar: string;
  passwordsMatch: string;
  changePassword: string;
  changing: string;
  cancel: string;
  success: string;
  error: string;
  fillAllFields: string;
  unauthorized: string;
  signInFailed: string;
}

export interface ChangePasswordScreenProps {
  translations: ChangePasswordTranslations;
  onSuccess?: () => void;
  onCancel?: () => void;
}

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

  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const isValid =
    isLengthValid &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    passwordsMatch &&
    currentPassword.length > 0;

  const handleChangePassword = async () => {
    if (!isValid) {
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

  const RequirementItem = ({ label, met }: { label: string; met: boolean }) => (
    <View style={styles.requirementItem}>
      <View
        style={[
          styles.requirementBullet,
          { backgroundColor: met ? tokens.colors.success : tokens.colors.border },
        ]}
      />
      <AtomicText
        type="bodySmall"
        style={{ color: met ? tokens.colors.textPrimary : tokens.colors.textSecondary }}
      >
        {label}
      </AtomicText>
    </View>
  );

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
            <RequirementItem label={translations.minLength} met={isLengthValid} />
            <RequirementItem label={translations.uppercase} met={hasUppercase} />
            <RequirementItem label={translations.lowercase} met={hasLowercase} />
            <RequirementItem label={translations.number} met={hasNumber} />
            <RequirementItem label={translations.specialChar} met={hasSpecialChar} />
            <RequirementItem label={translations.passwordsMatch} met={passwordsMatch} />
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
              disabled={!isValid || loading}
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
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
});
