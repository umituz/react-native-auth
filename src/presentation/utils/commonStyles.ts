/**
 * Common Styles
 * Shared style definitions for auth components
 */

import { StyleSheet } from "react-native";

/**
 * Action button style - used in account actions and profile sections
 */
export const actionButtonStyle = StyleSheet.create({
    container: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    text: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
});

/**
 * Input field styles - used in forms
 */
export const inputFieldStyle = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
});

/**
 * Card content styles
 */
export const cardContentStyle = StyleSheet.create({
    container: {
        padding: 16,
    },
    divider: {
        height: 24,
    },
});

/**
 * Avatar container styles
 */
export const avatarContainerStyle = StyleSheet.create({
    container: {
        marginRight: 12,
    },
});

/**
 * Info text styles
 */
export const infoTextStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    displayName: {
        marginBottom: 2,
    },
});
