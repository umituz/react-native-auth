/**
 * Edit Profile Screen
 * Pure UI for profile editing - Composition only
 */

import React from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useAppDesignTokens, AtomicText } from "@umituz/react-native-design-system";
import { EditProfileAvatar } from "../components/EditProfileAvatar";
import { EditProfileForm } from "../components/EditProfileForm";
import { EditProfileActions } from "../components/EditProfileActions";

export interface EditProfileLabels {
    title: string;
    displayNameLabel: string;
    displayNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    photoLabel: string;
    changePhotoButton: string;
    saveButton: string;
    cancelButton: string;
}

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
    labels: EditProfileLabels;
}

export interface EditProfileScreenProps {
    config: EditProfileConfig;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ config }) => {
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
            <AtomicText type="headlineSmall" style={styles.title}>
                {config.labels.title}
            </AtomicText>

            <EditProfileAvatar
                photoURL={config.photoURL}
                displayName={config.displayName}
            />

            <EditProfileForm
                displayName={config.displayName}
                email={config.email}
                onChangeDisplayName={config.onChangeDisplayName}
                onChangeEmail={config.onChangeEmail}
                labels={config.labels}
            />

            <EditProfileActions
                isSaving={config.isSaving}
                onSave={config.onSave}
                onCancel={config.onCancel}
                labels={config.labels}
            />
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
        marginBottom: 24,
    },
});

