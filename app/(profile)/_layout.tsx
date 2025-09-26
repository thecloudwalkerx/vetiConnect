import { Stack } from "expo-router";
import '../globals.css'

export default function ProfileLayout() {
    return <Stack>
        <Stack.Screen name="notification" options={{ headerShown: false }} />
        <Stack.Screen name="number" options={{ headerShown: false }} />
        <Stack.Screen name="password" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
    </Stack>
}