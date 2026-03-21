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
        // paddingHorizontal ve paddingBottom artık component içinden responsive olarak verilecek
        flexGrow: 1,
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
        // marginBottom artık component içinden responsive olarak verilecek
        // marginTop artık component içinden responsive olarak verilecek
        // paddingTop artık component içinden responsive olarak verilecek
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
