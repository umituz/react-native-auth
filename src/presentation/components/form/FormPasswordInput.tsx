import React, { forwardRef } from "react";
import { TextInput, StyleSheet, ViewStyle } from "react-native";
import { AtomicInput } from "@umituz/react-native-design-system";

export interface FormPasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
  style?: ViewStyle;
}

export const FormPasswordInput = forwardRef<React.ElementRef<typeof TextInput>, FormPasswordInputProps>(
  (
    {
      value,
      onChangeText,
      label,
      placeholder,
      error,
      disabled = false,
      onSubmitEditing,
      returnKeyType = "done",
      style,
    },
    ref
  ) => {
    return (
      <AtomicInput
        ref={ref}
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        autoCorrect={false}
        disabled={disabled}
        state={error ? "error" : "default"}
        helperText={error || undefined}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={returnKeyType === "done"}
        textContentType="oneTimeCode"
        style={[styles.input, style]}
      />
    );
  }
);

FormPasswordInput.displayName = "FormPasswordInput";

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
});
