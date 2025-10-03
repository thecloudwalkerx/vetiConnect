import { Link, useRouter } from "expo-router";
import React, { useRef, useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn, useUser } from "@clerk/clerk-expo";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { supabase } from "@/lib/supabase";

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const { user } = useUser();
    const router = useRouter();

    // ✅ refs just store values (not triggering re-renders)
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const [showPwd, setShowPwd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;

        const email = emailRef.current;
        const password = passwordRef.current;

        try {
            const attempt = await signIn.create({ identifier: email, password });

            if (attempt.status === "complete") {
                await setActive({ session: attempt.createdSessionId });

                const clerkUserId = user?.id;
                if (!clerkUserId) return;

                const { data, error } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", clerkUserId)
                    .maybeSingle();

                if (error) {
                    console.error("Supabase error:", error);
                    return;
                }

                if (!data) {
                    router.replace("/(auth)/complete-vet");
                    return;
                }

                router.replace(
                    data.role === "vet" ? "/(vet-tabs)/home" : "/(owner-tabs)/home"
                );
            } else {
                console.warn("Unexpected status:", attempt.status);
            }
        } catch (err: any) {
            console.error("Sign-in error:", err);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        if (user) {
            const role = (user.unsafeMetadata?.role as "vet" | "owner") || null;
            if (role === "vet") router.replace("/(vet-tabs)/home");
            else if (role === "owner") router.replace("/(owner-tabs)/home");
            else router.replace("/(auth)/complete-vet");
        }

        setRefreshing(false);
    }, [user, router]);

    const Field = ({
                       label,
                       placeholder,
                       leftIcon,
                       secure,
                       onChangeText,
                       rightToggle,
                   }: {
        label: string;
        placeholder: string;
        leftIcon: any;
        secure?: boolean;
        onChangeText: (v: string) => void;
        rightToggle?: React.ReactNode;
    }) => (
        <View className="mb-4">
            <Text className="text-sm text-black mb-1">{label}</Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-300 px-3">
                <Image source={leftIcon} className="w-5 h-5 opacity-70" />
                <TextInput
                    className="flex-1 ml-2 py-2 text-base text-black"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={secure}
                    // ✅ this updates ref only (no state updates → no re-render)
                    onChangeText={onChangeText}
                />
                {rightToggle}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0286FF]" edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View className="bg-white rounded-t-3xl px-5 pt-24 pb-80">
                        <Text className="text-2xl font-bold text-black">Login</Text>
                        <Text className="text-gray-500 mt-2 mb-6">
                            Please login to continue
                        </Text>

                        <Field
                            label="Email*"
                            placeholder="Enter email"
                            leftIcon={icons.email}
                            onChangeText={(text) => (emailRef.current = text)}
                        />

                        <Field
                            label="Password*"
                            placeholder="Password"
                            leftIcon={icons.lock}
                            secure={!showPwd}
                            onChangeText={(text) => (passwordRef.current = text)}
                            rightToggle={
                                <TouchableOpacity
                                    onPress={() => setShowPwd((s) => !s)}
                                    className="p-2"
                                    hitSlop={10}
                                >
                                    <Image
                                        source={icons.eyecross}
                                        className="w-5 h-5 opacity-70"
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <CustomButton
                            title="Login"
                            onPress={onSignInPress}
                            className="mt-6 h-16 rounded-2xl justify-center"
                        />

                        <Text className="text-center text-gray-500 mt-5">
                            Don’t have an account?{" "}
                            <Link href="/sign-up" className="text-[#0286FF]">
                                Register Here
                            </Link>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}