/**
 * Edit Profile Screen
 * Pure UI for profile editing
 * Business logic provided via props
 */

import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system";
import { Avatar } from "@umituz/react-native-avatar";

export interface EditProfileConfig {
    displayName: string;
    email: string;
    photoURL: string | null;
    isLoading?: boolean;
    isSaving?: boolean;
    onChangeDisplayName: (value: string) => void;
    onChangeEmail: (value: string) => void;
    onChangePhoto?: () => void;
    onSave: () => void;
    onCancel?: () => void;
    labels: {
        title: string;
        displayNameLabel: string;
        displayNamePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        photoLabel: string;
        changePhotoButton: string;
        saveButton: string;
        cancelButton: string;
    };
}

export interface EditProfileScreenProps {
    config: EditProfileConfig;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
    config,
}) => {
    const tokens = useAppDesignTokens();

    if (config.isLoading) {
        return (
            <View style={[styles.loading, { backgroundColor: tokens.colors.backgroundPrimary }]}>
                <ActivityIndicator size="large" color={tokens.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: tokens.colors.backgroundPrimary }]}
            contentContainerStyle={styles.content}
        >
            <Text style={[styles.title, { color: tokens.colors.text }]}>
                {config.labels.title}
            </Text>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Avatar
                    uri={config.photoURL || undefined}
                    name={config.displayName}
                    size="xl"
                    shape="circle"
                />
            </View>

            {/* Display Name */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
                    {config.labels.displayNameLabel}
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: tokens.colors.surface,
                            color: tokens.colors.text,
                            borderColor: tokens.colors.border,
                        },
                    ]}
                    value={config.displayName}
                    onChangeText={config.onChangeDisplayName}
                    placeholder={config.labels.displayNamePlaceholder}
                    placeholderTextColor={tokens.colors.textTertiary}
                />
            </View>

            {/* Email */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
                    {config.labels.emailLabel}
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: tokens.colors.surface,
                            color: tokens.colors.text,
                            borderColor: tokens.colors.border,
                        },
                    ]}
                    value={config.email}
                    onChangeText={config.onChangeEmail}
                    placeholder={config.labels.emailPlaceholder}
                    placeholderTextColor={tokens.colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Photo */}
            {config.onChangePhoto && (
                <View style={styles.field}>
                    <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
                        {config.labels.photoLabel}
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.photoButton,
                            { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border },
                        ]}
                        onPress={config.onChangePhoto}
                    >
                        <Text style={[styles.photoButtonText, { color: tokens.colors.primary }]}>
                            {config.labels.changePhotoButton}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: tokens.colors.primary }]}
                    onPress={config.onSave}
                    disabled={config.isSaving}
                >
                    {config.isSaving ? (
                        <ActivityIndicator size="small" color={tokens.colors.onPrimary} />
                    ) : (
                        <Text style={[styles.saveButtonText, { color: tokens.colors.onPrimary }]}>
                            {config.labels.saveButton}
                        </Text>
                    )}
                </TouchableOpacity>

                {config.onCancel && (
                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            { backgroundColor: tokens.colors.surface, borderColor: tokens.colors.border },
                        ]}
                        onPress={config.onCancel}
                        disabled={config.isSaving}
                    >
                        <Text style={[styles.cancelButtonText, { color: tokens.colors.text }]}>
                            {config.labels.cancelButton}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 24,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    field: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    photoButton: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
    },
    photoButtonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    actions: {
        marginTop: 32,
        gap: 12,
    },
    saveButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
});
