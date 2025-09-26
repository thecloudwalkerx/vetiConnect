import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

export const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            return item;
        } catch (error) {
            console.error("SecureStore get item error: ", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch {
            return;
        }
    },
};

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/"), // ✅ neutral redirect
        });

        if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });

            // Clerk User ID available, but no database code included here anymore.
            return {
                success: true,
                code: "success",
                message: "You have successfully signed in with Google",
            };
        }

        return {
            success: false,
            message: "An error occurred while signing in with Google",
        };
    } catch (err: any) {
        console.error(err);
        return {
            success: false,
            code: err.code,
            message: err?.errors?.[0]?.longMessage || "OAuth failed",
        };
    }
};
