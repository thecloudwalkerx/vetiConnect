import React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
    StatusBar,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { icons } from "@/constants";
import SearchButton from "@/components/SearchButton";   // ✅ Search for vets

export default function HomeScreen() {
    const { user } = useUser();
    const router = useRouter();

    const fullName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "Guest";

    const location = "Your Location"; // Replace with Clerk metadata if available

    const forumItems = [
        {
            title: "Forum",
            desc: "Join the community discussion",
            img: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?fit=crop&w=200&q=80",
        },
        {
            title: "News Portal",
            desc: "Read the latest pet health news",
            img: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?fit=crop&w=200&q=80",
        },
        {
            title: "All",
            desc: "Explore all discussions and articles",
            img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?fit=crop&w=200&q=80",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Fixed Top Section */}
            <View className="px-4 flex-none">
                {/* 🔔 Header */}
                <View
                    className="flex-row items-center mb-6"
                    style={{
                        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                    }}
                >
                    {/* Profile Image */}
                    <TouchableOpacity onPress={() => router.push("/(owner-tabs)/profile")}>
                        <Image
                            source={{ uri: user?.imageUrl || "https://i.pravatar.cc/100" }}
                            className="w-12 h-12 rounded-full"
                        />
                    </TouchableOpacity>

                    {/* Name + Location */}
                    <TouchableOpacity
                        onPress={() => router.push("/(owner-tabs)/profile")}
                        className="flex-1 ml-3"
                    >
                        <Text className="text-lg font-bold text-gray-800">{fullName}</Text>
                        <Text className="text-xs text-gray-500">{location}</Text>
                    </TouchableOpacity>

                    {/* Notification / Star */}
                    <TouchableOpacity>
                        <Image source={icons.star} className="w-6 h-6" />
                    </TouchableOpacity>
                </View>

                {/* ✅ New Search Button – opens /match screen */}
                <View className="mb-6">
                    <SearchButton />
                </View>

                {/* 🟦 Bento Layout */}
                <View className="flex-row mb-6">
                    {/* Left Column : Navigate to the new pet-tabs home */}
                    <TouchableOpacity
                        className="flex-1 bg-indigo-500 rounded-xl p-4 mr-2 justify-between"
                        onPress={() => router.push("/(pet-tabs)/home")}
                    >
                        <View>
                            <Text className="text-white text-xs mb-1">Profile</Text>
                            <Text className="text-white font-bold text-sm">
                                Manage Pet Profile
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-3">
                            <Image source={icons.profile} className="w-6 h-6 mr-2" />
                            <Text className="text-white text-xs">View & Edit</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Right Column */}
                    <View className="flex-1">
                        <TouchableOpacity
                            className="bg-amber-500 rounded-xl p-4 mb-2"
                            onPress={() => router.push("/wrong-route/prescriptions")}
                        >
                            <Text className="text-white text-xs mb-1">History</Text>
                            <Text className="text-white font-bold text-sm">Prescriptions</Text>
                            <View className="flex-row items-center mt-2">
                                <Image source={icons.list} className="w-6 h-6 mr-2" />
                                <Text className="text-white text-xs">View Records</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-green-500 rounded-xl p-4"
                            onPress={() => Linking.openURL("https://www.arogga.com/")}   // ✅ open external link
                        >
                            <Text className="text-white text-xs mb-1">Shop</Text>
                            <Text className="text-white font-bold text-sm">
                                Medicine Store
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <Image source={icons.list} className="w-6 h-6 mr-2" />
                                <Text className="text-white text-xs">Buy Medicines</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* ⚡ Quick Access */}
                <View className="flex-row justify-between mb-4">
                    <TouchableOpacity className="items-center flex-1">
                        <Image source={icons.home} className="w-8 h-8 mb-1" />
                        <Text className="text-sm text-gray-700">Hospital</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center flex-1">
                        <Image source={icons.map} className="w-8 h-8 mb-1" />
                        <Text className="text-sm text-gray-700">Ambulance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center flex-1">
                        <Image source={icons.person} className="w-8 h-8 mb-1" />
                        <Text className="text-sm text-gray-700">Help</Text>
                    </TouchableOpacity>
                </View>

                {/* Forum Title Row */}
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-bold text-gray-800">Forum</Text>
                    <TouchableOpacity onPress={() => Linking.openURL("https://facebook.com")}>
                        <Text className="text-xs text-indigo-600 font-semibold">View All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ✅ Only Forum Scrolls */}
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {forumItems.map((item, idx) => (
                    <View
                        key={idx}
                        className="bg-white rounded-xl p-3 shadow-sm flex-row mb-3"
                    >
                        <Image source={{ uri: item.img }} className="w-20 h-20 rounded-lg" />
                        <View className="flex-1 ml-3 justify-center">
                            <Text className="text-gray-800 font-bold text-sm">{item.title}</Text>
                            <Text className="text-gray-600 text-xs mb-2">{item.desc}</Text>
                            <TouchableOpacity
                                onPress={() => Linking.openURL("https://facebook.com")}
                            >
                                <Text className="text-indigo-600 text-xs font-semibold">Open →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
