import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import OAuth from "@/components/OAuth";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard
} from "react-native";
import { useSignIn, useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { supabase } from "@/lib/supabase";

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const { user } = useUser();                // ✅ will hold the active user after setActive
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const validateInputs = () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            Toast.show({ type: "error", text1: "Invalid email format" });
            return false;
        }
        if (password.length < 6) {
            Toast.show({ type: "error", text1: "Password must be at least 6 characters" });
            return false;
        }
        return true;
    };

    const onSignInPress = async () => {
        Keyboard.dismiss();
        if (!isLoaded || !validateInputs()) return;

        try {
            const attempt = await signIn.create({
                identifier: email,
                password,
            });

            if (attempt.status === "complete") {
                await setActive({ session: attempt.createdSessionId });
                Toast.show({ type: "success", text1: "Login successful!" });

                // ✅ After session is active, use Clerk user.id
                const clerkUserId = user?.id;
                if (!clerkUserId) {
                    Toast.show({ type: "error", text1: "Could not read user ID from Clerk" });
                    return;
                }

                // ✅ safer query: maybeSingle returns null if no row
                const { data, error } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", clerkUserId)
                    .maybeSingle();

                if (error) {
                    Toast.show({ type: "error", text1: "Database error fetching role" });
                    return;
                }

                if (!data) {
                    // No profile row found – user hasn’t completed their profile yet
                    Toast.show({
                        type: "error",
                        text1: "No profile found. Please complete your profile."
                    });
                    router.replace("/(auth)/complete-profile");
                    return;
                }

                // ✅ Redirect based on stored role
                router.replace(
                    data.role === "vet" ? "/(vet-tabs)/home" : "/(owner-tabs)/home"
                );

            } else {
                Toast.show({
                    type: "error",
                    text1: `Unexpected status: ${attempt.status}`,
                });
            }
        } catch (err: any) {
            console.error("Sign-in error:", err);
            Toast.show({
                type: "error",
                text1: err?.errors?.[0]?.message || "Sign-in failed",
            });
        }
    };

    const Field = ({
                       label,
                       placeholder,
                       leftIcon,
                       secure,
                       value,
                       onChangeText,
                       rightToggle,
                       keyboardType = "default"
                   }: {
        label: string;
        placeholder: string;
        leftIcon: any;
        secure?: boolean;
        value: string;
        onChangeText: (v: string) => void;
        rightToggle?: React.ReactNode;
        keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    }) => (
        <View className="mb-4">
            <Text className="text-sm text-black mb-1">{label}</Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-300 px-3">
                <Image source={leftIcon} className="w-5 h-5 opacity-70" />
                <TextInput
                    className="flex-1 ml-2 py-2 text-base text-black"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!!secure}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    blurOnSubmit={false}
                    onSubmitEditing={() => {}}
                    returnKeyType="next"
                />
                {rightToggle}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0286FF]">
            <KeyboardAwareScrollView
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            >
                <View className="bg-white rounded-t-3xl px-5 pt-24 pb-8">
                    <Text className="text-2xl font-bold text-black">Login</Text>
                    <Text className="text-gray-500 mt-2 mb-6">Please login to continue</Text>

                    <Field
                        label="Email*"
                        placeholder="Enter email"
                        leftIcon={icons.email}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <Field
                        label="Password*"
                        placeholder="Password"
                        leftIcon={icons.lock}
                        secure={!showPwd}
                        value={password}
                        onChangeText={setPassword}
                        rightToggle={
                            <TouchableOpacity
                                onPress={() => setShowPwd((s) => !s)}
                                className="p-2"
                                hitSlop={10}
                            >
                                <Image source={icons.eyecross} className="w-5 h-5 opacity-70" />
                            </TouchableOpacity>
                        }
                    />

                    <CustomButton
                        title="Login"
                        onPress={onSignInPress}
                        className="mt-6 h-16 rounded-2xl justify-center"
                    />
                    <OAuth />

                    <Text className="text-center text-gray-500 mt-5">
                        Don’t have an account?{" "}
                        <Link href="/sign-up" className="text-[#0286FF]">
                            Register Here
                        </Link>
                    </Text>
                </View>
            </KeyboardAwareScrollView>
            <Toast />
        </SafeAreaView>
    );
}
