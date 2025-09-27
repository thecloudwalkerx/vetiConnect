import { View, Text, StyleSheet } from "react-native";

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>💬 Chat Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
    },
    text: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
});
