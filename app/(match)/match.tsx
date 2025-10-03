import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

/** 🔍 Fetch all online vets and combine details from profiles tables */
async function fetchOnlineVets() {
    // 1️⃣ Only take activity info that is still in vet_activity
    const { data: activities, error: activityError } = await supabase
        .from("vet_activity")
        .select("user_id, is_verified, title")   // ⬅️ removed speciality here
        .eq("is_online", true);

    if (activityError) throw new Error(activityError.message);
    if (!activities || activities.length === 0) return [];

    const userIds = activities.map((a) => a.user_id);

    // 2️⃣ Profiles table (basic info)
    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, email")
        .in("user_id", userIds);

    if (profilesError) throw new Error(profilesError.message);

    // 3️⃣ Vet profile table (extended info, including speciality)
    const { data: vetProfiles, error: vetProfilesError } = await supabase
        .from("profile_vet")
        .select("user_id, phone_number, certification_link, speciality") // ⬅️ speciality now here
        .in("user_id", userIds);

    if (vetProfilesError) throw new Error(vetProfilesError.message);

    // 4️⃣ Merge everything
    return activities.map((act) => {
        const profile = profiles?.find((p) => p.user_id === act.user_id);
        const vetProfile = vetProfiles?.find((v) => v.user_id === act.user_id);
        return {
            userId: act.user_id,
            firstName: profile?.first_name ?? "",
            lastName: profile?.last_name ?? "",
            email: profile?.email ?? "",
            title: act.title,
            speciality: vetProfile?.speciality ?? "",   // ⬅️ take from profile_vet
            phone: vetProfile?.phone_number ?? "",
            certificationLink: vetProfile?.certification_link ?? "",
            isVerified: act.is_verified,
        };
    });
}

export default function MatchScreen() {
    const [loading, setLoading] = useState(true);
    const [vets, setVets] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const result = await fetchOnlineVets();
                setVets(result);
            } catch (err: any) {
                console.error("Error loading vets:", err);
                setError(err.message || "Failed to load vets");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#5A67D8" />
                <Text className="mt-2 text-gray-600">Loading vets…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-4">
                <Text className="text-red-500 text-center">Error: {error}</Text>
            </View>
        );
    }

    if (vets.length === 0) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-700">No vets are online right now.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-4">
            <Text className="text-xl font-bold text-gray-800 mb-4">Online Vets</Text>
            <FlatList
                data={vets}
                keyExtractor={(item) => item.userId}
                renderItem={({ item }) => (
                    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {item.firstName} {item.lastName} {item.isVerified ? "(Vet)" : ""}
                        </Text>
                        <Text className="text-sm text-gray-600">{item.title}</Text>
                        <Text className="text-sm text-gray-600 mb-1">
                            Speciality: {item.speciality}
                        </Text>
                        <Text className="text-sm text-gray-500">📧 {item.email}</Text>
                        <Text className="text-sm text-gray-500 mb-3">📞 {item.phone}</Text>

                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/(chat)/window",
                                    params: { vetId: item.userId },
                                })
                            }
                            className="bg-indigo-500 rounded-xl py-2"
                        >
                            <Text className="text-center text-white font-semibold">
                                Chat Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
