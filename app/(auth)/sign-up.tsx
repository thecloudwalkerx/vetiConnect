import { Link, useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    RefreshControl,
    Pressable,
} from "react-native";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

export default function SignUpScreen() {
    const { signUp, isLoaded } = useSignUp();
    const { user } = useUser();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [role, setRole] = useState<"vet" | "owner" | "">("");

    // Track validation errors
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [refreshing, setRefreshing] = useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded) return;

        const newErrors: any = {};
        if (!firstName) newErrors.firstName = true;
        if (!lastName) newErrors.lastName = true;
        if (!email) newErrors.email = true;
        if (!password) newErrors.password = true;
        if (!role) newErrors.role = true;
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
                unsafeMetadata: { role },
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            router.replace("/verify");
        } catch (err: any) {
            console.error("Sign-up error:", err);
            alert(err?.errors?.[0]?.message || "Sign-up failed");
        }
    };

    // ---------- Pull to refresh ----------
    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        if (user) {
            const role = (user.unsafeMetadata?.role as "vet" | "owner") || null;
            if (role === "vet") {
                router.replace("/(vet-tabs)/home");
            } else if (role === "owner") {
                router.replace("/(owner-tabs)/home");
            } else {
                router.replace("/(auth)/complete-vet");
            }
        }

        setRefreshing(false);
    }, [user, router]);

    // ---------- Field ----------
    const Field = ({
                       label,
                       placeholder,
                       leftIcon,
                       secure,
                       value,
                       onChangeText,
                       rightToggle,
                       errorKey,
                   }: {
        label: string;
        placeholder: string;
        leftIcon: any;
        secure?: boolean;
        value: string;
        onChangeText: (v: string) => void;
        rightToggle?: React.ReactNode;
        errorKey: string;
    }) => (
        <View className="mb-4">
            <Text className="text-sm text-black mb-1">{label}</Text>
            <View
                className={`flex-row items-center rounded-xl border px-3 ${
                    errors[errorKey]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-gray-50"
                }`}
            >
                <Image source={leftIcon} className="w-5 h-5 opacity-70" />
                <TextInput
                    className="flex-1 ml-2 py-2 text-base text-black"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={secure}
                    value={value}
                    onChangeText={onChangeText}
                />
                {rightToggle}
            </View>
        </View>
    );

    // ---------- Role Button ----------
    const RoleButton = ({ value, label }: { value: "vet" | "owner"; label: string }) => (
        <Pressable
            onPress={() => setRole(value)}
            className={`px-4 py-2 mr-3 rounded-xl border ${
                role === value
                    ? "bg-[#0286FF] border-[#0286FF]"
                    : errors.role
                        ? "border-red-500"
                        : "border-gray-300"
            }`}
        >
            <Text className={`${role === value ? "text-white" : "text-black"}`}>
                {label}
            </Text>
        </Pressable>
    );

    // ---------- Layout ----------
    return (
        <SafeAreaView className="flex-1 bg-[#0286FF]">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="bg-white rounded-t-3xl px-5 py-24">
                    <Text className="text-2xl font-bold text-black">Register</Text>
                    <Text className="text-gray-500 mt-2 mb-2">
                        Please register before login
                    </Text>

                    <Field
                        label="First Name*"
                        placeholder="Enter first name"
                        leftIcon={icons.person}
                        value={firstName}
                        onChangeText={setFirstName}
                        errorKey="firstName"
                    />

                    <Field
                        label="Last Name*"
                        placeholder="Enter last name"
                        leftIcon={icons.person}
                        value={lastName}
                        onChangeText={setLastName}
                        errorKey="lastName"
                    />

                    <Field
                        label="Email*"
                        placeholder="Enter email"
                        leftIcon={icons.email}
                        value={email}
                        onChangeText={setEmail}
                        errorKey="email"
                    />

                    <Field
                        label="Password*"
                        placeholder="Password"
                        leftIcon={icons.lock}
                        secure={!showPwd}
                        value={password}
                        onChangeText={setPassword}
                        errorKey="password"
                        rightToggle={
                            <Pressable
                                onPress={() => setShowPwd((s) => !s)}
                                className="p-2"
                                hitSlop={10}
                            >
                                <Image source={icons.eyecross} className="w-5 h-5 opacity-70" />
                            </Pressable>
                        }
                    />

                    {/* Role selector */}
                    <View className="mb-4">
                        <Text className="text-sm text-black mb-1">I am a*</Text>
                        <View
                            className={`flex-row rounded-xl px-2 py-2 ${
                                errors.role
                                    ? "border border-red-500 bg-red-50"
                                    : "border border-transparent"
                            }`}
                        >
                            <RoleButton value="vet" label="Vet" />
                            <RoleButton value="owner" label="Owner" />
                        </View>
                    </View>

                    <CustomButton
                        title="Register"
                        onPress={onSignUpPress}
                        className="mt-6 h-16 rounded-2xl justify-center"
                    />

                    <Text className="text-center text-gray-500 mt-5">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-[#0286FF]">
                            Login Here
                        </Link>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
