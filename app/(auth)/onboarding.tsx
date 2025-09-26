import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { onboardingContent } from '@/constants';
import CustomButton from "@/components/CustomButton";

const Onboarding = () => {
    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const isLastSlide = activeIndex === onboardingContent.length - 1;

    return (
        <SafeAreaView className="flex h-full items-center justify-between bg-white">
            {/* Skip button */}
            <TouchableOpacity
                onPress={() => {
                    router.replace('/(auth)/sign-up');
                }}
                className="w-full flex justify-end items-end p-5"
            >
                <Text className="text-black text-md font-bold">Skip</Text>
            </TouchableOpacity>

            {/* Swiper */}
            <Swiper
                ref={swiperRef}
                loop={false}
                dot={
                    <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
                }
                activeDot={
                    <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
                }
                onIndexChanged={(index) => setActiveIndex(index)}
            >
                {onboardingContent.map((item) => (
                    <View
                        key={item.id}
                        className="flex-1 items-center justify-start p-5"
                    >
                        <Image
                            source={item.image}
                            style={{ height: 380, width: 280 }}
                            resizeMode="contain"
                        />
                        <Text className="text-lg text-center opacity-80">
                            {item.description}
                        </Text>
                    </View>
                ))}
            </Swiper>

            <CustomButton
                title={isLastSlide ? "Get Started" : "Next"}
                onPress={() =>
                    isLastSlide
                        ? router.replace("/(auth)/sign-up")
                        : swiperRef.current?.scrollBy(1)
                }
                className="w-11/12 mt-10 mb-5"
            />
        </SafeAreaView>
    );
};

export default Onboarding;
