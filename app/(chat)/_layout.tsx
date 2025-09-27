import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Layout for the (chat) route group.
 * Ensures the chat window is full-screen and hides the tab bar.
 */
export default function ChatLayout() {
    return (
        <>
            {/* Consistent status bar styling for the chat window */}
            <StatusBar style="light" backgroundColor="#5A67D8" />

            <Stack
                screenOptions={{
                    headerShown: false,      // hide default header
                    presentation: "card",    // standard full-screen presentation
                }}
            />
        </>
    );
}
