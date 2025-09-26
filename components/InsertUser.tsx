import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';  // Import the Supabase client

export default function InsertUser() {
    const [loading, setLoading] = useState(false);

    // Function to insert a user into the 'profiles' table
    const insertUser = async () => {
        setLoading(true);
        try {
            // Insert a new user into the 'profiles' table (test data)
            const { data, error } = await supabase.from("profiles").insert([
                {
                    user_id: "test-user-id",  // Use a mock user ID for now (Replace with Clerk user ID)
                    first_name: "John",       // First name
                    last_name: "Doe",         // Last name
                    email: "john.doe@example.com", // Email
                    created_at: new Date().toISOString(),  // Timestamp
                },
            ]);

            if (error) {
                throw error;
            }

            // If insertion was successful, show an alert
            Alert.alert("Success", "User inserted into profiles successfully!");
            console.log("Inserted data:", data);
        } catch (error) {
            console.error("Error inserting user:", error.message);
            Alert.alert("Error", "Failed to insert user into profiles.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Button
                title={loading ? "Inserting..." : "Insert User"}
                onPress={insertUser}
                disabled={loading}
            />
        </View>
    );
}
