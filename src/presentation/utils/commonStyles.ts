/**
 * Common Styles
 * Shared style definitions for auth components
 */

import { StyleSheet } from "react-native";

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
