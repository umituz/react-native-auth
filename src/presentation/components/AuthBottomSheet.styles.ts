import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    background: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 80,
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 8,
        zIndex: 10,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        marginTop: 8,
        paddingTop: 16,
    },
    title: {
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        textAlign: "center",
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
    },
});
