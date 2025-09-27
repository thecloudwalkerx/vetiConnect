import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import {
    sendMessage,
    fetchMessages,
    subscribeToMessages,
} from "@/app/api/chat_api";
import { supabase } from "@/lib/supabase";

export default function ChatWindow() {
    const { user } = useUser();
    const { vetId } = useLocalSearchParams<{ vetId: string }>();

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [vetInfo, setVetInfo] = useState<{
        firstName: string;
        lastName: string;
        imageUrl?: string;
    } | null>(null);

    const flatListRef = useRef<FlatList>(null);
    const roomId = [user?.id, vetId].sort().join("_");

    /** Load vet details for the header */
    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("first_name, last_name, email")
                    .eq("user_id", vetId)
                    .single();

                if (!error && data) {
                    setVetInfo({
                        firstName: data.first_name,
                        lastName: data.last_name,
                        imageUrl: user?.imageUrl || "https://i.pravatar.cc/150",
                    });
                }
            } catch (err) {
                console.error("Error loading vet info:", err);
            }
        })();
    }, [vetId]);

    /** Load messages and subscribe for realtime */
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        (async () => {
            try {
                const data = await fetchMessages(roomId);
                setMessages(data);
                unsubscribe = subscribeToMessages(roomId, (newMessage) => {
                    setMessages((prev) => [...prev, newMessage]);
                    flatListRef.current?.scrollToEnd({ animated: true });
                });
            } catch (err) {
                console.error("Error loading messages:", err);
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [roomId]);

    const handleSend = async () => {
        if (!input.trim() || !user?.id) return;
        try {
            await sendMessage(roomId, user.id, input.trim(), true);
            setInput("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#5A67D8" />
                <Text className="mt-2 text-gray-600">Loading chat…</Text>
            </SafeAreaView>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-100"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            // offset so input stays above keyboard (adjust if header height changes)
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <SafeAreaView className="flex-1">
                {/* ======= Header with Vet info ======= */}
                <View className="flex-row items-center bg-white px-4 py-3 border-b border-gray-200">
                    {vetInfo?.imageUrl && (
                        <Image
                            source={{ uri: vetInfo.imageUrl }}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                    )}
                    <View>
                        <Text className="text-lg font-bold text-gray-900">
                            {vetInfo?.firstName} {vetInfo?.lastName}
                        </Text>
                        <Text className="text-xs text-green-600">Online</Text>
                    </View>
                </View>

                {/* ======= Messages ======= */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    renderItem={({ item }) => {
                        const isUserMsg = item.is_user;
                        return (
                            <View
                                className={`mb-3 flex ${
                                    isUserMsg ? "items-end" : "items-start"
                                }`}
                            >
                                <View
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        isUserMsg ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                >
                                    <Text
                                        className={`text-base ${
                                            isUserMsg ? "text-white" : "text-gray-900"
                                        }`}
                                    >
                                        {item.text}
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-500 mt-1">
                                    {formatTime(item.created_at)}
                                </Text>
                            </View>
                        );
                    }}
                />

                {/* ======= Input bar ======= */}
                <View className="flex-row items-center bg-white px-4 py-3 border-t border-gray-200">
                    <TextInput
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-base text-black"
                        placeholder="Write a message…"
                        placeholderTextColor="#9CA3AF"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        className="ml-3 bg-blue-500 rounded-full px-4 py-2"
                    >
                        <Text className="text-white font-semibold">Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
