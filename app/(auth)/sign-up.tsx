import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import OAuth from "@/components/OAuth";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

export default function SignUpScreen() {
    const { signUp, isLoaded } = useSignUp();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    // 👇 NEW: store Vet / Owner selection
    const [role, setRole] = useState<"vet" | "owner" | "">("");

    const validateInputs = () => {
        if (!firstName || !lastName) {
            alert("First and last name are required");
            return false;
        }
        if (!role) {
            alert("Please select whether you are a Vet or an Owner");
            return false;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert("Invalid email format");
            return false;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        if (!validateInputs()) return;

        try {
            // ➡ Create Clerk user and attach the chosen role in unsafeMetadata
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
                unsafeMetadata: { role }, // ✅ store selected role
            });

            // ➡ Trigger email OTP
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // ➡ Go to verification screen
            router.replace("/verify");
        } catch (err: any) {
            console.error("Sign-up error:", err);
            alert(err?.errors?.[0]?.message || "Sign-up failed");
        }
    };

    // ---------- Small reusable components ----------

    const Field = ({
                       label,
                       placeholder,
                       leftIcon,
                       secure,
                       value,
                       onChangeText,
                       rightToggle,
                   }: {
        label: string;
        placeholder: string;
        leftIcon: any;
        secure?: boolean;
        value: string;
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
                    secureTextEntry={!!secure}
                    value={value}
                    onChangeText={onChangeText}
                    blurOnSubmit={false}
                />
                {rightToggle}
            </View>
        </View>
    );

    const RoleButton = ({ value, label }: { value: "vet" | "owner"; label: string }) => (
        <TouchableOpacity
            onPress={() => setRole(value)}
            className={`px-4 py-2 mr-3 rounded-xl border ${
                role === value ? "bg-[#0286FF] border-[#0286FF]" : "border-gray-300"
            }`}
        >
            <Text className={`${role === value ? "text-white" : "text-black"}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    // ---------- Screen Layout ----------
    return (
        <SafeAreaView className="flex-1 bg-[#0286FF]">
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            >
                <View className="bg-white rounded-t-3xl px-5 py-10">
                    <Text className="text-2xl font-bold text-black">Register</Text>
                    <Text className="text-gray-500 mt-2 mb-6">
                        Please register before login
                    </Text>

                    <Field
                        label="First Name*"
                        placeholder="Enter first name"
                        leftIcon={icons.person}
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <Field
                        label="Last Name*"
                        placeholder="Enter last name"
                        leftIcon={icons.person}
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <Field
                        label="Email*"
                        placeholder="Enter email"
                        leftIcon={icons.email}
                        value={email}
                        onChangeText={setEmail}
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
                                <Image
                                    source={icons.eyecross}
                                    className="w-5 h-5 opacity-70"
                                />
                            </TouchableOpacity>
                        }
                    />

                    {/* ✅ NEW: Role selector */}
                    <Text className="text-sm text-black mb-1">I am a*</Text>
                    <View className="flex-row mb-4">
                        <RoleButton value="vet" label="Vet" />
                        <RoleButton value="owner" label="Owner" />
                    </View>

                    <CustomButton
                        title="Register"
                        onPress={onSignUpPress}
                        className="mt-6 h-16 rounded-2xl justify-center"
                    />
                    <OAuth />

                    <Text className="text-center text-gray-500 mt-5">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-[#0286FF]">
                            Login Here
                        </Link>
                    </Text>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
