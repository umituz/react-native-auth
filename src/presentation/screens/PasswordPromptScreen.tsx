import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import {
  AtomicInput,
  AtomicButton,
  AtomicText,
  AtomicIcon,
  SafeAreaView,
  useAppDesignTokens
} from '@umituz/react-native-design-system';
import { resolvePasswordPrompt } from '../utils/passwordPromptCallback';

declare const __DEV__: boolean;

export interface PasswordPromptScreenProps {
  route: {
    params: {
      title?: string;
      message?: string;
      confirmText?: string;
      cancelText?: string;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

export const PasswordPromptScreen: React.FC<PasswordPromptScreenProps> = ({
  route,
  navigation,
}) => {
  const tokens = useAppDesignTokens();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[PasswordPromptScreen] Rendered");
  }

  const {
    title = 'Password Required',
    message = 'Enter your password to continue',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = route.params;

  const handleConfirm = () => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[PasswordPromptScreen] handleConfirm called, password length:", password.length);
    }
    // Don't trim password - whitespace may be intentional
    if (!password) {
      setError('Password is required');
      return;
    }
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[PasswordPromptScreen] Resolving password prompt and going back");
    }
    resolvePasswordPrompt(password);
    navigation.goBack();
  };

  const handleCancel = () => {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[PasswordPromptScreen] handleCancel called");
    }
    resolvePasswordPrompt(null);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.headerBar, { borderBottomColor: tokens.colors.border }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <AtomicIcon name="close" size="lg" color="textSecondary" />
        </TouchableOpacity>
        <AtomicText type="headlineLarge" fontWeight="600" color="textPrimary">
          {title}
        </AtomicText>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.container, { padding: tokens.spacing.xl }]}>
          <View style={styles.messageContainer}>
            <AtomicText type="bodyMedium" color="textSecondary" style={styles.message}>
              {message}
            </AtomicText>
          </View>

          <View style={styles.content}>
            <AtomicInput
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                setError('');
              }}
              placeholder="Password"
              secureTextEntry
              state={error ? 'error' : 'default'}
              helperText={error}
              style={{ marginBottom: tokens.spacing.md }}
            />
          </View>

          <View style={[styles.buttons, { gap: tokens.spacing.sm }]}>
            <AtomicButton
              title={cancelText}
              onPress={handleCancel}
              variant="secondary"
              style={styles.button}
            />
            <AtomicButton
              title={confirmText}
              onPress={handleConfirm}
              variant="primary"
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
    width: 40,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
});
