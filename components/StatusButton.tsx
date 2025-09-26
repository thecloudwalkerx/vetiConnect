import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { updateVetOnlineStatus } from "@/app/api/vet_api";
import { supabase } from "@/lib/supabase";

/**
 * A button to toggle the vet's online status.
 * Shows "Go Online" when offline and "Go Offline" when online.
 * Updates the vet_activity.is_online column in Supabase.
 */
export default function StatusButton() {
    const { user } = useUser();
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Load the current status from Supabase when component mounts
    useEffect(() => {
        const fetchStatus = async () => {
            if (!user?.id) return;
            const { data, error } = await supabase
                .from("vet_activity")
                .select("is_online")
                .eq("user_id", user.id)
                .single();

            if (!error && data?.is_online !== undefined) {
                setIsOnline(data.is_online);
            } else if (error) {
                console.error("Error fetching online status:", error.message);
            }
        };

        fetchStatus();
    }, [user?.id]);

    const toggleStatus = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const newStatus = !isOnline;
            await updateVetOnlineStatus(user.id, newStatus);
            setIsOnline(newStatus);

            Toast.show({
                type: "success",
                text1: newStatus ? "You are now Online" : "You are now Offline",
            });
        } catch (err: any) {
            console.error("Error toggling status:", err);
            Toast.show({
                type: "error",
                text1: err?.message || "Could not update status",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={toggleStatus}
            disabled={loading}
            className={`rounded-xl px-6 py-4 ${
                isOnline ? "bg-green-500" : "bg-gray-400"
            } flex-row justify-center items-center`}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-base">
                    {isOnline ? "Go Offline" : "Go Online"}
                </Text>
            )}
        </TouchableOpacity>
    );
}
