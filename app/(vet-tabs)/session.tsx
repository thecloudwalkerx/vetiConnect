// app/(user-tabs)/session.tsx
import React, { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { icons } from "@/constants";

export default function SessionScreen() {
    const router = useRouter();

    // Mock session data (replace with Clerk/DB later)
    const sessionHistory = [
        {
            id: 1,
            name: "Haydee, Ph.D.",
            specialist: "Ophthalmologist",
            status: "Finish",
            image: "https://i.pravatar.cc/150?img=12",
        },
        {
            id: 2,
            name: "Viki, Ph.D.",
            specialist: "Ophthalmologist",
            status: "Cancel",
            image: "https://i.pravatar.cc/150?img=32",
        },
        {
            id: 3,
            name: "Dr. Selly",
            specialist: "General Practitioner",
            status: "Finish",
            image: "https://i.pravatar.cc/150?img=45",
        },
    ];

    const [searchActive, setSearchActive] = useState(false);
    const [query, setQuery] = useState("");

    // Filtered sessions
    const filteredSessions = sessionHistory.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 mt-2 mb-4">
                {/* Title or Search Bar */}
                {searchActive ? (
                    <TextInput
                        className="flex-1 mx-3 bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
                        placeholder="Search appointments..."
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                ) : (
                    <Text className="text-lg font-bold text-gray-900">
                        Appointment History
                    </Text>
                )}

                {/* Action Buttons */}
                <View className="flex-row space-x-4">
                    {searchActive ? (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchActive(false);
                                setQuery("");
                            }}
                        >
                            <Text className="text-red-500 font-bold">✕</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setSearchActive(true)}>
                            <Image source={icons.search} className="w-5 h-5" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity>
                        <Image source={icons.list} className="w-5 h-5" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Session History */}
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                {filteredSessions.length > 0 ? (
                    <>
                        {filteredSessions.map((item) => (
                            <View
                                key={item.id}
                                className="bg-white rounded-xl p-4 shadow-sm flex-row items-center mb-4"
                            >
                                {/* Doctor image */}
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-14 h-14 rounded-full mr-3"
                                />

                                {/* Doctor Info */}
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-800">{item.name}</Text>
                                    <Text className="text-xs text-gray-500">{item.specialist}</Text>
                                </View>

                                {/* Status + Button */}
                                <View className="items-end">
                                    <Text
                                        className={`text-xs font-semibold mb-2 ${
                                            item.status === "Finish"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        • {item.status}
                                    </Text>
                                    <TouchableOpacity
                                        className="px-5 py-2 border border-indigo-500 rounded-lg"
                                        onPress={() => router.push("/wrong-route/consult-again")}
                                    >
                                        <Text className="text-sm text-indigo-600 font-semibold">
                                            Consult Again
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {/* ✅ End of history marker */}
                        <Text className="text-center text-gray-400 text-xs mt-4 opacity-70">
                            — End of History —
                        </Text>
                    </>
                ) : (
                    <Text className="text-center text-gray-500 mt-10">
                        No appointments found.
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
