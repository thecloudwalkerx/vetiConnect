import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

/**
 * Layout for the (pet-tabs) group.
 * All screens in this folder (e.g. home.tsx) will show full-screen
 * and automatically hide the bottom tabs of the owner navigation.
 */
export default function PetLayout() {
    return (
        <>
            {/* Consistent StatusBar style for this group */}
            <StatusBar style="dark" backgroundColor="#F9FAFB" />
            <Stack
                screenOptions={{
                    headerShown: false,   // ✅ hide default header for a clean full-screen look
                }}
            />
        </>
    );
}
