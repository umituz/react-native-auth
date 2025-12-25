import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicInput } from "@umituz/react-native-design-system";

export interface EditProfileFormProps {
    displayName: string;
    email: string;
    onChangeDisplayName: (value: string) => void;
    onChangeEmail: (value: string) => void;
    labels: {
        displayNameLabel: string;
        displayNamePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
    };
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
    displayName,
    email,
    onChangeDisplayName,
    onChangeEmail,
    labels,
}) => {
    return (
        <View>
            <View style={styles.field}>
                <AtomicInput
                    label={labels.displayNameLabel}
                    value={displayName}
                    onChangeText={onChangeDisplayName}
                    placeholder={labels.displayNamePlaceholder}
                />
            </View>

            <View style={styles.field}>
                <AtomicInput
                    label={labels.emailLabel}
                    value={email}
                    onChangeText={onChangeEmail}
                    placeholder={labels.emailPlaceholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    field: {
        marginBottom: 20,
    },
});

