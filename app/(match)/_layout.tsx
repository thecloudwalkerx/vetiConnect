import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Layout for the (match) group.
 * Provides a simple Stack navigator so the Match screen
 * opens full-screen and hides the bottom tabs automatically.
 */
export default function MatchLayout() {
    return (
        <>
            {/* optional StatusBar for consistent styling */}
            <StatusBar style="dark" backgroundColor="#F9FAFB" />
            <Stack
                screenOptions={{
                    headerShown: false, // hide default header; match page will be full screen
                }}
            />
        </>
    );
}
