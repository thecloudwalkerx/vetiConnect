import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import CustomButton from "@/components/CustomButton";
import { createUserInDatabase } from "@/app/api/user_api";
import { createVetInDatabase } from "@/app/api/vet_api";

export default function VerifyScreen() {
    const { signUp, setActive, isLoaded } = useSignUp();
    const router = useRouter();

    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const inputs = useRef<Array<TextInput | null>>([]);

    const onVerifyPress = async () => {
        if (!isLoaded || !signUp) return;

        try {
            // ✅ Verify the 6-digit code sent by Clerk
            const attempt = await signUp.attemptEmailAddressVerification({
                code: code.join(""),
            });

            if (attempt.status === "complete") {
                // ✅ Activate the Clerk session
                await setActive?.({ session: attempt.createdSessionId });

                const userId = attempt.createdUserId;
                const role   = (signUp.unsafeMetadata as any)?.role as "vet" | "owner" | undefined;
                const first  = signUp.firstName || "";
                const last   = signUp.lastName  || "";
                const email  = signUp.emailAddress || "";

                // ✅ Insert into Supabase through the correct API
                if (role === "vet") {
                    await createVetInDatabase({
                        userId,
                        firstName: first,
                        lastName:  last,
                        email,
                    });
                } else {
                    await createUserInDatabase({
                        userId,
                        firstName: first,
                        lastName:  last,
                        email,
                    });
                }

                Toast.show({ type: "success", text1: "Verification successful!" });

                /**
                 * ✅ Important change:
                 * Instead of sending vets straight to their home,
                 * redirect everyone back to the app root.
                 * The root (index.tsx) now checks:
                 *   – role
                 *   – whether profile_vet exists
                 * and decides whether to show complete-profile or home.
                 */
                router.replace("/");

            } else {
                Toast.show({
                    type: "error",
                    text1: `Unexpected status: ${attempt.status}`,
                });
            }
        } catch (err: any) {
            console.error("Verification error:", err);
            Toast.show({
                type: "error",
                text1: err?.errors?.[0]?.message || "Verification failed",
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0286FF]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <View className="flex-1 bg-white rounded-t-3xl px-5 pt-24">
                    <Text className="text-2xl font-bold text-black mb-2">Verify Email</Text>
                    <Text className="text-gray-500 mb-8">
                        Enter the 6-digit code sent to your email
                    </Text>

                    <View className="flex-row justify-between mt-8">
                        {code.map((digit, i) => (
                            <TextInput
                                key={i}
                                ref={(el) => { inputs.current[i] = el; }}
                                maxLength={1}
                                keyboardType="numeric"
                                className="border-b-2 border-[#0286FF] text-center text-xl text-black w-11"
                                value={digit}
                                onChangeText={(val) => {
                                    const newCode = [...code];
                                    newCode[i] = val;
                                    setCode(newCode);
                                    if (val && i < inputs.current.length - 1) {
                                        inputs.current[i + 1]?.focus();
                                    }
                                }}
                                onKeyPress={({ nativeEvent }) => {
                                    if (
                                        nativeEvent.key === "Backspace" &&
                                        !code[i] &&
                                        i > 0
                                    ) {
                                        inputs.current[i - 1]?.focus();
                                    }
                                }}
                            />
                        ))}
                    </View>

                    <Text className="text-center text-gray-500 mt-8">
                        Didn’t receive an OTP?
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            signUp?.prepareEmailAddressVerification({ strategy: "email_code" })
                        }
                    >
                        <Text className="text-center font-semibold text-[#0286FF] mt-1">
                            Resend OTP
                        </Text>
                    </TouchableOpacity>

                    <CustomButton
                        title="Next"
                        onPress={onVerifyPress}
                        className="mt-10 h-16 rounded-2xl justify-center"
                    />
                </View>
            </KeyboardAvoidingView>

            <Toast />
        </SafeAreaView>
    );
}
