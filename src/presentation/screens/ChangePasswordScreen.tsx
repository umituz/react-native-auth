/**
 * Change Password Screen
 * Screen for users to update their password
 *
 * Features:
 * - Current password validation via re-authentication
 * - New password validation (strength, match)
 * - Secure error handling
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
  type AtomicInputProps,
} from "@umituz/react-native-design-system";
import { useLocalization } from "@umituz/react-native-localization";
import {
  updateUserPassword,
  reauthenticateWithPassword,
  getCurrentUserFromGlobal,
  getFirebaseAuth,
} from "@umituz/react-native-firebase";

export interface ChangePasswordScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useLocalization();
  const tokens = useAppDesignTokens();
  const auth = getFirebaseAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Removed manual visibility states */
  /* const [showCurrentPassword, setShowCurrentPassword] = useState(false); */
  /* const [showNewPassword, setShowNewPassword] = useState(false); */
  /* const [showConfirmPassword, setShowConfirmPassword] = useState(false); */

  // Validation state
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
        Alert.alert(t("common.error"), t("auth.passwordChange.fillAllFields"));
        return;
    }

    const user = getCurrentUserFromGlobal();
    if (!user) {
      setError(t("auth.errors.unauthorized"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Re-authenticate
      const reauthResult = await reauthenticateWithPassword(user, currentPassword);
      if (!reauthResult.success) {
        setError(reauthResult.error?.message || t("auth.alerts.error.signInFailed"));
        setLoading(false);
        return;
      }

      // 2. Update Password
      const updateResult = await updateUserPassword(user, newPassword);
      if (updateResult.success) {
        Alert.alert(t("common.success"), t("auth.passwordChange.success"), [
            { text: "OK", onPress: onSuccess }
        ]);
        if (onSuccess) onSuccess(); 
      } else {
        setError(updateResult.error?.message || t("auth.passwordChange.error"));
      }
    } catch (e: any) {
      setError(e.message || t("auth.passwordChange.error"));
    } finally {
      setLoading(false);
    }
  };

  const RequirementsList = () => (
    <View style={styles.requirementsContainer}>
      <AtomicText type="labelMedium" style={{ color: tokens.colors.textSecondary, marginBottom: 8 }}>
        {t("auth.passwordChange.requirements")}
      </AtomicText>
      <RequirementItem label={t("auth.passwordChange.minLength")} met={isLengthValid} />
      <RequirementItem label={t("auth.passwordChange.uppercase")} met={hasUppercase} />
      <RequirementItem label={t("auth.passwordChange.lowercase")} met={hasLowercase} />
      <RequirementItem label={t("auth.passwordChange.number")} met={hasNumber} />
      <RequirementItem label={t("auth.passwordChange.specialChar")} met={hasSpecialChar} />
      <RequirementItem label={t("auth.passwordChange.passwordsMatch")} met={passwordsMatch} />
    </View>
  );

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
      header={<ScreenHeader title={t("auth.passwordChange.title")} />}
      backgroundColor={tokens.colors.backgroundPrimary}
      edges={["bottom"]}
    >
      <View style={styles.content}>
        <AtomicText type="bodyMedium" style={{ color: tokens.colors.textSecondary, marginBottom: 24 }}>
          {t("auth.passwordChange.description")}
        </AtomicText>

        <View style={styles.form}>
           {/* Current Password */}
          <AtomicInput
            label={t("auth.passwordChange.currentPassword")}
            placeholder={t("auth.passwordChange.enterCurrentPassword")}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            showPasswordToggle
            variant="filled"
          />

           {/* New Password */}
          <AtomicInput
            label={t("auth.passwordChange.newPassword")}
            placeholder={t("auth.passwordChange.enterNewPassword")}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            showPasswordToggle
            variant="filled"
          />

           {/* Confirm Password */}
          <AtomicInput
            label={t("auth.passwordChange.confirmPassword")}
            placeholder={t("auth.passwordChange.enterConfirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            showPasswordToggle
            variant="filled"
          />

          <RequirementsList />

          {error && (
            <AtomicText style={{ color: tokens.colors.error, marginTop: 16 }}>
              {error}
            </AtomicText>
          )}

          <View style={styles.actions}>
             <AtomicButton
              title={t("common.cancel")}
              onPress={onCancel || (() => {})}
              variant="outline"
              style={{ flex: 1 }}
            />
            <AtomicButton
              title={loading ? t("auth.passwordChange.changing") : t("auth.passwordChange.changePassword")}
              onPress={handleChangePassword}
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
    backgroundColor: "rgba(0,0,0,0.05)",
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
