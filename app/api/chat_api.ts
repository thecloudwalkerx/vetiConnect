import { supabase } from "@/lib/supabase";

/**
 * Insert a new message into the `messages` table.
 * @param roomId   Unique room identifier (e.g. [ownerId, vetId].sort().join("_"))
 * @param senderId Clerk user ID of the message sender
 * @param text     Message text
 * @param isUser   true if the sender is the owner/user, false if vet
 */
export async function sendMessage(
    roomId: string,
    senderId: string,
    text: string,
    isUser: boolean
) {
    const { error } = await supabase.from("messages").insert([
        {
            room_id: roomId,
            sender_id: senderId,
            text,
            is_user: isUser,
        },
    ]);

    if (error) throw new Error(`Error sending message: ${error.message}`);
}

/**
 * Fetch all messages for a given room, sorted by time (oldest first).
 */
export async function fetchMessages(roomId: string) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

    if (error) throw new Error(`Error fetching messages: ${error.message}`);
    return data || [];
}

/**
 * Subscribe to realtime updates for a room.
 * @param roomId   Room identifier
 * @param callback Called with the new message row whenever a new message arrives
 * @returns a cleanup function you should call on unmount to unsubscribe
 */
export function subscribeToMessages(
    roomId: string,
    callback: (payload: any) => void
) {
    const channel = supabase
        .channel(`room:${roomId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `room_id=eq.${roomId}`,
            },
            (payload) => {
                callback(payload.new);
            }
        )
        .subscribe();

    // return a function that unsubscribes when you no longer need updates
    return () => {
        supabase.removeChannel(channel);
    };
}
