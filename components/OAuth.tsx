import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";
import { useSignUp, useSession } from "@clerk/clerk-expo"; // Import useSession hook
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import { createUserInDatabase } from "@/app/api/user_api"; // Import your API method

const OAuth = () => {
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const { signUp } = useSignUp(); // Use signUp from Clerk
    const { session, isLoaded } = useSession(); // Get the session and loading state

    const handleGoogleSignIn = async () => {
        const result = await googleOAuth(startOAuthFlow);

        if (result.success) {
            // Wait for the session to be loaded
            if (!isLoaded || !session?.user) {
                Alert.alert("Error", "User session not found or session is still loading");
                return;
            }

            const user = session.user;

            // Ensure emailAddresses exists and get the first email address
            const email = user.emailAddresses && user.emailAddresses[0]?.emailAddress;

            // Now that we have the user data, insert it into Supabase
            if (email) {
                await createUserInDatabase({
                    userId: user.id, // Clerk user ID
                    firstName: user.firstName || "", // Clerk first name
                    lastName: user.lastName || "", // Clerk last name
                    email, // Clerk email
                });

                Alert.alert("Success", result.message);
                router.replace("/(tabs)/home");
            } else {
                Alert.alert("Error", "User email not found");
            }
        } else {
            Alert.alert("Error", result.message);
        }
    };

    return (
        <View>
            <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
                <View className="flex-1 h-[1px] bg-general-100" />
                <Text className="text-lg text-gray-600">Or</Text>
                <View className="flex-1 h-[1px] bg-general-100" />
            </View>

            <CustomButton
                title="Log In with Google"
                className="mt-5 w-full shadow-none"
                IconLeft={() => (
                    <Image
                        source={icons.google}
                        resizeMode="contain"
                        className="w-5 h-5 mx-2"
                    />
                )}
                bgVariant="outline"
                textVariant="primary"
                onPress={handleGoogleSignIn}
            />
        </View>
    );
};

export default OAuth;
