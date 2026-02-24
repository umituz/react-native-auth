import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicButton } from "@umituz/react-native-design-system/atoms";

interface EditProfileActionsProps {
    isSaving?: boolean;
    onSave: () => void;
    onCancel?: () => void;
    labels: {
        saveButton: string;
        cancelButton: string;
    };
}

export const EditProfileActions: React.FC<EditProfileActionsProps> = ({
    isSaving,
    onSave,
    onCancel,
    labels,
}) => {
    return (
        <View style={styles.actions}>
            <AtomicButton
                variant="primary"
                onPress={onSave}
                disabled={isSaving}
                fullWidth
            >
                {labels.saveButton}
            </AtomicButton>

            {onCancel && (
                <AtomicButton
                    variant="outline"
                    onPress={onCancel}
                    disabled={isSaving}
                    fullWidth
                >
                    {labels.cancelButton}
                </AtomicButton>
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    actions: {
        marginTop: 32,
        gap: 12,
    },
});

