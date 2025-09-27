import { supabase } from "@/lib/supabase";

/**
 * Fetch all pets belonging to a specific user.
 */
export async function getPetsByUser(userId: string) {
    try {
        const { data, error } = await supabase
            .from("pet_profile")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) throw new Error(error.message);
        return data ?? [];
    } catch (err: any) {
        console.error("Error fetching pets:", err.message);
        throw new Error(`Error fetching pets: ${err.message}`);
    }
}

/**
 * Add a new pet for the given user.
 */
export async function addPet(userId: string, pet: {
    name: string;
    type: string;
    breed?: string;
    age?: number;
    eye_color?: string;
    body_color?: string;
}) {
    try {
        const { data, error } = await supabase
            .from("pet_profile")
            .insert([{
                user_id: userId,
                name: pet.name,
                type: pet.type,
                breed: pet.breed || null,
                age: pet.age ?? null,
                eye_color: pet.eye_color || null,
                body_color: pet.body_color || null,
            }])
            .select()
            .single(); // return inserted row

        if (error) throw new Error(error.message);
        return data;
    } catch (err: any) {
        console.error("Error adding pet:", err.message);
        throw new Error(`Error adding pet: ${err.message}`);
    }
}

/**
 * Remove a pet by its id (only if it belongs to this user).
 */
export async function removePet(userId: string, petId: string) {
    try {
        const { error } = await supabase
            .from("pet_profile")
            .delete()
            .eq("user_id", userId)
            .eq("id", petId);

        if (error) throw new Error(error.message);
        return true;
    } catch (err: any) {
        console.error("Error removing pet:", err.message);
        throw new Error(`Error removing pet: ${err.message}`);
    }
}
