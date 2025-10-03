import { supabase } from "@/lib/supabase";

/**
 * Insert a new **Vet** into the profiles table.
 * Called right after sign-up / verification.
 */
export async function createVetInDatabase(userData: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}) {
    try {
        const { data, error } = await supabase.from("profiles").insert([
            {
                user_id: userData.userId, // Clerk user ID
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                role: "vet",
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            console.error("Error inserting vet:", error.message);
            throw new Error(`Error inserting vet: ${error.message}`);
        }

        return data;
    } catch (error: any) {
        console.error("Error inserting vet into database:", error.message);
        throw new Error(`Error creating vet in the database: ${error.message}`);
    }
}

/**
 * Insert the extended vet profile into `profile_vet`
 * AND create the corresponding activity record in `vet_activity`.
 * Called from the Complete-Profile screen after the vet fills in details.
 */
export async function createVetProfile(profileData: {
    userId: string;            // Clerk user id (must match profiles.user_id)
    title: string;
    certificationLink?: string;
    speciality: string;
    phoneNumber: string;
    isVerified?: boolean;      // optional override; default handled below
}) {
    try {
        // 1️⃣ Insert into profile_vet
        const { error: profileError } = await supabase.from("profile_vet").insert([
            {
                user_id: profileData.userId,
                title: profileData.title,
                certification_link: profileData.certificationLink || null,
                speciality: profileData.speciality,
                phone_number: profileData.phoneNumber,
            },
        ]);

        if (profileError) {
            console.error("Error inserting vet profile:", profileError.message);
            throw new Error(`Error inserting vet profile: ${profileError.message}`);
        }

        // 2️⃣ Insert into vet_activity (❌ no speciality here)
        const { error: activityError } = await supabase.from("vet_activity").insert([
            {
                user_id: profileData.userId,
                is_online: false, // default initial status
                is_verified: profileData.isVerified ?? false,
                title: profileData.title,
                // created_at handled by DB default
            },
        ]);

        if (activityError) {
            console.error("Error inserting vet activity:", activityError.message);
            throw new Error(`Error inserting vet activity: ${activityError.message}`);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error creating vet profile/activity:", error.message);
        throw new Error(
            `Error creating vet profile or activity in the database: ${error.message}`
        );
    }
}

/**
 * ✅ Toggle or set the vet's online status in vet_activity.
 */
export async function updateVetOnlineStatus(userId: string, isOnline: boolean) {
    try {
        const { error } = await supabase
            .from("vet_activity")
            .update({ is_online: isOnline })
            .eq("user_id", userId);

        if (error) {
            console.error("Error updating vet online status:", error.message);
            throw new Error(`Error updating vet online status: ${error.message}`);
        }

        return { success: true, isOnline };
    } catch (error: any) {
        console.error("Error toggling vet online status:", error.message);
        throw new Error(
            `Error toggling vet online status in the database: ${error.message}`
        );
    }
}
