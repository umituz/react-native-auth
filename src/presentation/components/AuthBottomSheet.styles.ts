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
        paddingBottom: 40,
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 8,
        zIndex: 10,
    },
    closeIcon: {
        fontSize: 24,
        fontWeight: "400",
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        marginTop: 8,
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
    },
});
