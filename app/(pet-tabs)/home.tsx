import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { getPetsByUser, addPet, removePet } from "@/app/api/pet_api";
import { icons } from "@/constants";

export default function PetHomeScreen() {
    const { user } = useUser();
    const userId = user?.id;

    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // fields for adding a pet
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [eyeColor, setEyeColor] = useState("");
    const [bodyColor, setBodyColor] = useState("");

    async function loadPets() {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await getPetsByUser(userId);
            setPets(data);
            setError(null);
        } catch (err: any) {
            console.error("Error loading pets:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPets();
    }, [userId]);

    async function handleAddPet() {
        if (!userId) return;
        if (!name.trim() || !type.trim()) {
            Alert.alert("Validation", "Name and Type are required.");
            return;
        }
        try {
            await addPet(userId, {
                name,
                type,
                breed,
                age: age ? Number(age) : undefined,
                eye_color: eyeColor,
                body_color: bodyColor,
            });
            // Clear inputs
            setName(""); setType(""); setBreed(""); setAge("");
            setEyeColor(""); setBodyColor("");
            await loadPets();
        } catch (err: any) {
            Alert.alert("Error", err.message || "Could not add pet");
        }
    }

    async function handleRemovePet(petId: string) {
        if (!userId) return;
        Alert.alert(
            "Remove Pet",
            "Are you sure you want to remove this pet?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removePet(userId, petId);
                            await loadPets();
                        } catch (err: any) {
                            Alert.alert("Error", err.message || "Could not remove pet");
                        }
                    },
                },
            ]
        );
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#5A67D8" />
                <Text className="mt-2 text-gray-600">Loading pets…</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center px-4">
                <Text className="text-red-500 text-center">Error: {error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-xl font-bold text-gray-800 mb-4">Your Pets</Text>

                {/* Existing pets list */}
                {pets.length === 0 ? (
                    <View className="bg-gray-200 rounded-xl p-6 mb-6 justify-center items-center">
                        <Text className="text-gray-600 font-medium">— No pet, add one —</Text>
                    </View>
                ) : (
                    <FlatList
                        data={pets}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row justify-between items-center">
                                <View>
                                    <Text className="text-lg font-semibold text-gray-900">
                                        {item.name} ({item.type})
                                    </Text>
                                    {item.breed ? (
                                        <Text className="text-sm text-gray-600">Breed: {item.breed}</Text>
                                    ) : null}
                                    {item.age ? (
                                        <Text className="text-sm text-gray-600">Age: {item.age}</Text>
                                    ) : null}
                                    {item.eye_color ? (
                                        <Text className="text-sm text-gray-600">Eye Color: {item.eye_color}</Text>
                                    ) : null}
                                    {item.body_color ? (
                                        <Text className="text-sm text-gray-600">Body Color: {item.body_color}</Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity
                                    className="bg-red-500 rounded-full px-4 py-2"
                                    onPress={() => handleRemovePet(item.id)}
                                >
                                    <Text className="text-white font-semibold">Remove</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

                {/* Add new pet form */}
                <Text className="text-lg font-bold text-gray-800 mt-6 mb-3">
                    Add a New Pet
                </Text>

                {[
                    { label: "Name*", value: name, set: setName },
                    { label: "Type*", value: type, set: setType },
                    { label: "Breed", value: breed, set: setBreed },
                    { label: "Age", value: age, set: setAge, keyboardType: "numeric" },
                    { label: "Eye Color", value: eyeColor, set: setEyeColor },
                    { label: "Body Color", value: bodyColor, set: setBodyColor },
                ].map((f, idx) => (
                    <View key={idx} className="mb-3">
                        <Text className="text-sm text-black mb-1">{f.label}</Text>
                        <TextInput
                            className="bg-white rounded-xl border border-gray-300 px-3 py-2 text-base text-black"
                            value={f.value}
                            onChangeText={f.set}
                            keyboardType={(f as any).keyboardType || "default"}
                        />
                    </View>
                ))}

                <TouchableOpacity
                    className="bg-green-600 rounded-xl py-3 mt-4 items-center"
                    onPress={handleAddPet}
                >
                    <Text className="text-white font-bold text-lg">Add Pet</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
