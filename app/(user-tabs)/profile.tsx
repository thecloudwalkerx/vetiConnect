// app/(user-tabs)/profile.tsx
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { icons } from "@/constants";

export default function ProfileScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { signOut } = useAuth();
    const { fontScale } = useWindowDimensions();

    const fullName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "Guest";

    const menuItems = [
        {
            label: "Password",
            desc: "Update and Modify Password",
            route: "/(profile)/password",
            icon: icons.lock,
        },
        {
            label: "Phone Number",
            desc: "Update and Modify Phone Number",
            route: "/(profile)/number",
            icon: icons.person,
        },
        {
            label: "Payment Method",
            desc: "Update and Modify Payment Method",
            route: "/(profile)/payment",
            icon: icons.dollar,
        },
        {
            label: "Notification",
            desc: "Update and Modify Notification",
            route: "/(profile)/notification",
            icon: icons.list,
        },
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (err) {
            console.error("Sign-out error:", err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="bg-[#5B5BE3] pt-12 pb-16 items-center rounded-b-[30px] mb-10">
                    <Text className="text-2xl font-bold text-white mb-2">{fullName}</Text>
                    <Image
                        source={{
                            uri: user?.imageUrl || "https://i.pravatar.cc/150?img=5",
                        }}
                        className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10"
                    />
                </View>

                {/* Menu */}
                <View className="bg-white mx-4 rounded-xl shadow-sm overflow-hidden">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`flex-row items-center px-4 py-4 ${
                                index !== menuItems.length - 1 ? "border-b border-gray-200" : ""
                            }`}
                            onPress={() => router.push(item.route as any)}
                        >
                            <Image
                                source={item.icon}
                                className="w-6 h-6 mr-3"
                                resizeMode="contain"
                            />
                            <View className="flex-1">
                                <Text
                                    className="font-semibold text-gray-800"
                                    style={{ fontSize: 16 * fontScale }}
                                >
                                    {item.label}
                                </Text>
                                <Text
                                    className="text-xs text-gray-500"
                                    style={{ fontSize: 12 * fontScale }}
                                >
                                    {item.desc}
                                </Text>
                            </View>
                            <Text className="text-gray-400 text-xl">›</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm overflow-hidden">
                    <TouchableOpacity
                        className="flex-row items-center px-4 py-4"
                        onPress={handleSignOut}
                    >
                        <Image
                            source={icons.out}
                            className="w-6 h-6 mr-3"
                            resizeMode="contain"
                        />
                        <View className="flex-1">
                            <Text className="font-semibold text-red-600 text-base">
                                Logout
                            </Text>
                        </View>
                        <Text className="text-gray-400 text-xl">›</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
