import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicAvatar } from "@umituz/react-native-design-system";

export interface EditProfileAvatarProps {
    photoURL: string | null;
    displayName: string;
    onPress?: () => void;
}

export const EditProfileAvatar: React.FC<EditProfileAvatarProps> = ({
    photoURL,
    displayName,
}) => {
    return (
        <View style={styles.avatarContainer}>
            <AtomicAvatar
                source={photoURL ? { uri: photoURL } : undefined}
                name={displayName}
                size="xl"
            />

        </View>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
});

