import React, { forwardRef } from "react";
import { TextInput, StyleSheet, ViewStyle } from "react-native";
import { AtomicInput } from "@umituz/react-native-design-system";

interface FormEmailInputProps {
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

export const FormEmailInput = forwardRef<React.ElementRef<typeof TextInput>, FormEmailInputProps>(
  (
    {
      value,
      onChangeText,
      label,
      placeholder,
      error,
      disabled = false,
      onSubmitEditing,
      returnKeyType = "next",
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
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={disabled}
        state={error ? "error" : "default"}
        helperText={error || undefined}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={returnKeyType === "done"}
        textContentType="emailAddress"
        style={[styles.input, style]}
      />
    );
  }
);

FormEmailInput.displayName = "FormEmailInput";

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
});
