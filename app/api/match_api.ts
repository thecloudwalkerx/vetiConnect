import { supabase } from "@/lib/supabase";

/**
 * Get the list of Clerk user IDs for vets who are currently online.
 * (Only reads the vet_activity table.)
 */
export async function fetchOnlineVetIds(): Promise<string[]> {
    const { data, error } = await supabase
        .from("vet_activity")
        .select("user_id")
        .eq("is_online", true);

    if (error) {
        console.error("Error fetching online vet ids:", error);
        throw new Error(error.message);
    }

    return (data || []).map(row => row.user_id as string);
}
