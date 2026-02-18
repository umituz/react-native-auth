import React, { forwardRef } from "react";
import { TextInput, StyleSheet, ViewStyle } from "react-native";
import { AtomicInput } from "@umituz/react-native-design-system";

interface FormTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
  style?: ViewStyle;
}

export const FormTextInput = forwardRef<React.ElementRef<typeof TextInput>, FormTextInputProps>(
  (
    {
      value,
      onChangeText,
      label,
      placeholder,
      error,
      disabled = false,
      autoCapitalize = "none",
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
        autoCapitalize={autoCapitalize}
        disabled={disabled}
        state={error ? "error" : "default"}
        helperText={error || undefined}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={returnKeyType === "done"}
        style={[styles.input, style]}
      />
    );
  }
);

FormTextInput.displayName = "FormTextInput";

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
});
