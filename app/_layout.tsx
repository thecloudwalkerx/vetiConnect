import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/auth";
import "setimmediate";
import "./globals.css";

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(vet-tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(owner-tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(profile)" options={{ headerShown: false }} />
                <Stack.Screen name="api" options={{ headerShown: false }} />
            </Stack>
        </ClerkProvider>
    );
}
