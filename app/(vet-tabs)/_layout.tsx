import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Image, ImageSourcePropType, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants";

// Reusable Tab Icon
const TabIcon = ({
                     source,
                     focused,
                 }: {
    source: ImageSourcePropType;
    focused: boolean;
}) => (
    <View
        style={{
            justifyContent: "center",
            alignItems: "center",
            width: 60,
            height: 50,
            borderRadius: 30,
            backgroundColor: focused ? "#5A67D8" : "transparent",
            marginTop: 30,
        }}
    >
        <Image
            source={source}
            resizeMode="contain"
            style={{
                width: 28,
                height: 28,
                tintColor: focused ? "white" : "#9CA3AF",
            }}
        />
    </View>
);

export default function Layout() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return null;
    if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

    return (
        <>
            <StatusBar style="light" backgroundColor="#5B5BE3" />

            <Tabs
                initialRouteName="home"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "#333333",
                        borderRadius: 40,
                        marginHorizontal: 20,
                        marginBottom: 15,
                        height: 70,
                        position: "absolute",
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon source={icons.home} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="chat"
                    options={{
                        title: "Chat",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon source={icons.chat} focused={focused} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="session"
                    options={{
                        title: "Session",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon source={icons.home} focused={focused} /> // temp
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ focused }) => (
                            <TabIcon source={icons.profile} focused={focused} />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}
