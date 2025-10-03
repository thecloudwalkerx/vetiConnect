import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Index() {
    const { isLoaded, isSignedIn, userId } = useAuth();

    const [role, setRole] = useState<"vet" | "owner" | null>(null);
    const [needsVetProfile, setNeedsVetProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoleAndProfile = async () => {
            if (!isSignedIn || !userId) {
                setLoading(false);
                return;
            }

            try {
                // 1️⃣ Get role from profiles table
                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("user_id", userId)
                    .single();

                if (profileError || !profileData?.role) {
                    console.error("Error fetching role:", profileError);
                    setLoading(false);
                    return;
                }

                const userRole = profileData.role as "vet" | "owner";
                setRole(userRole);

                // 2️⃣ If vet, check if profile_vet record exists
                if (userRole === "vet") {
                    const { data: vetData, error: vetError } = await supabase
                        .from("profile_vet")
                        .select("id")
                        .eq("user_id", userId)
                        .maybeSingle();

                    if (vetError) {
                        console.error("Error checking vet profile:", vetError);
                    }
                    // If no record, we need to complete profile
                    if (!vetData) {
                        setNeedsVetProfile(true);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoleAndProfile();
    }, [isSignedIn, userId]);

    // Wait until Clerk has loaded and all DB checks are done
    if (!isLoaded || loading) return null;

    if (!isSignedIn) {
        // Not signed in -> go to onboarding
        return <Redirect href="/(auth)/onboarding" />;
    }

    // Signed in -> redirect according to role & profile status
    if (role === "vet") {
        return needsVetProfile
            ? <Redirect href="/(auth)/complete-vet" />
            : <Redirect href="/(vet-tabs)/home" />;
    }

    // Default for owner
    return <Redirect href="/(owner-tabs)/home" />;
}
