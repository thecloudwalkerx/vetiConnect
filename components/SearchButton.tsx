import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants";

/**
 * A reusable button that navigates to the /match screen
 * to view all vets who are currently online.
 */
export default function SearchButton() {
    const router = useRouter();

    const goToMatchScreen = () => {
        router.push("/match"); // Ensure you have app/match.tsx created
    };

    return (
        <TouchableOpacity
            onPress={goToMatchScreen}
            className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm"
            activeOpacity={0.8}
        >
            <Image source={icons.search} className="w-5 h-5 mr-2" />
            <Text className="text-base text-gray-500">Search for Vets</Text>
        </TouchableOpacity>
    );
}
