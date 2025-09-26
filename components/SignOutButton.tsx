import React from "react"
import { TouchableOpacity, Text } from "react-native"
import { useAuth } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"

export default function SignOutButton() {
    const { signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.replace("/(auth)/sign-in") // 👈 send back to sign-in
        } catch (err) {
            console.error("Sign-out error:", err)
        }
    }

    return (
        <TouchableOpacity
            onPress={handleSignOut}
            style={{
                backgroundColor: "#E53935",
                paddingVertical: 14,
                borderRadius: 12,
                marginTop: 20,
            }}
        >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                Sign Out
            </Text>
        </TouchableOpacity>
    )
}
