/**
 * Edit Profile Screen
 * Pure UI for profile editing - Composition only
 */

import React from "react";
import { StyleSheet } from "react-native";
import { useAppDesignTokens } from "@umituz/react-native-design-system/theme";
import { AtomicText, AtomicSpinner } from "@umituz/react-native-design-system/atoms";
import { ScreenLayout } from "@umituz/react-native-design-system/layouts";
import { EditProfileAvatar } from "../components/EditProfileAvatar";
import { EditProfileForm } from "../components/EditProfileForm";
import { EditProfileActions } from "../components/EditProfileActions";

interface EditProfileLabels {
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

interface EditProfileConfig {
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
            <ScreenLayout
                backgroundColor={tokens.colors.backgroundPrimary}
                contentContainerStyle={styles.loadingContainer}
            >
                <AtomicSpinner size="lg" color="primary" fullContainer />
            </ScreenLayout>
        );
    }

    return (
        <ScreenLayout
            scrollable
            backgroundColor={tokens.colors.backgroundPrimary}
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
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 16,
    },
    title: {
        marginBottom: 24,
    },
});

