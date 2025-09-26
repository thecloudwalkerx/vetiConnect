import { supabase } from "@/lib/supabase";

/**
 * Insert a new **Owner** into the profiles table.
 */
export async function createUserInDatabase(userData: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}) {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .insert([
                {
                    user_id: userData.userId,   // Clerk user ID
                    first_name: userData.firstName,
                    last_name:  userData.lastName,
                    email:      userData.email,
                    role:       "owner",        // ✅ fixed for owners
                    created_at: new Date().toISOString(),
                },
            ]);

        if (error) {
            console.error("Error inserting owner:", error.message);
            throw new Error(`Error inserting owner: ${error.message}`);
        }

        return data;
    } catch (error: any) {
        console.error("Error inserting owner into database:", error.message);
        throw new Error(`Error creating owner in the database: ${error.message}`);
    }
}
