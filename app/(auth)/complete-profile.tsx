import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { createVetProfile } from "@/app/api/vet_api";
import { useRouter } from "expo-router";

export default function CompleteProfileScreen() {
    const { user } = useUser();
    const router = useRouter();

    // Form state
    const [title, setTitle] = useState("");
    const [certLink, setCertLink] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [phone, setPhone] = useState("");

    const validate = () => {
        if (!title.trim() || !speciality.trim() || !phone.trim()) {
            Toast.show({
                type: "error",
                text1: "Title, Speciality and Phone number are required",
            });
            return false;
        }
        return true;
    };

    const onSubmit = async () => {
        if (!validate() || !user?.id) return;

        try {
            // ✅ is_verified is true only if a certification link is provided
            const isVerified = certLink.trim().length > 0;

            await createVetProfile({
                userId: user.id,
                title,
                certificationLink: certLink,
                speciality,
                phoneNumber: phone,
                // pass our verification logic to the API
                isVerified,
                // is_online will default to false inside the API
            });

            Toast.show({ type: "success", text1: "Profile completed successfully!" });
            router.replace("/(vet-tabs)/home");
        } catch (err: any) {
            console.error("Insert error:", err);
            Toast.show({
                type: "error",
                text1: err?.message || "Could not save profile",
            });
        }
    };

    // Reusable input field
    const Field = ({
                       label,
                       placeholder,
                       value,
                       onChangeText,
                       leftIcon,
                       keyboardType,
                   }: {
        label: string;
        placeholder: string;
        value: string;
        onChangeText: (v: string) => void;
        leftIcon: any;
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
                    value={value}
                    keyboardType={keyboardType || "default"}
                    onChangeText={onChangeText}
                    blurOnSubmit={false}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0286FF]">
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            >
                <View className="bg-white rounded-t-3xl px-5 py-10">
                    <Text className="text-2xl font-bold text-black mb-2">
                        Complete Vet Profile
                    </Text>
                    <Text className="text-gray-500 mb-6">
                        Please provide your professional details
                    </Text>

                    <Field
                        label="Title*"
                        placeholder="e.g. Dr., DVM"
                        value={title}
                        onChangeText={setTitle}
                        leftIcon={icons.person}
                    />

                    <Field
                        label="Certification Link"
                        placeholder="Paste certificate URL"
                        value={certLink}
                        onChangeText={setCertLink}
                        leftIcon={icons.link || icons.star}
                    />

                    <Field
                        label="Speciality*"
                        placeholder="e.g. Small Animals, Surgery"
                        value={speciality}
                        onChangeText={setSpeciality}
                        leftIcon={icons.list}
                    />

                    <Field
                        label="Phone Number*"
                        placeholder="e.g. +8801XXXXXXXXX"
                        value={phone}
                        onChangeText={setPhone}
                        leftIcon={icons.phone || icons.person}
                        keyboardType="phone-pad"
                    />

                    <CustomButton
                        title="Save Profile"
                        onPress={onSubmit}
                        className="mt-6 h-16 rounded-2xl justify-center"
                    />
                </View>
            </KeyboardAwareScrollView>

            <Toast />
        </SafeAreaView>
    );
}
