import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring
} from 'react-native-reanimated';
import { useTabBarVisibility } from '../app/contexts/TabBarVisibilityContext';
import { HapticTab } from '@/components/HapticTab';
import { BlurView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
    activeTintColor: string;
    inactiveTintColor: string;
}

const CustomTabBar = ({
    state,
    descriptors,
    navigation,
    activeTintColor,
    inactiveTintColor,
}: CustomTabBarProps) => {
    const { isVisible } = useTabBarVisibility();
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    let tabBarHeight = 90; // fallback height

    try {
        tabBarHeight = useBottomTabBarHeight();
    } catch (e) {
        // context not ready yet, fallback remains
    }


    const insets = useSafeAreaInsets();

    useEffect(() => {
        translateY.value = withTiming(isVisible ? 0 : 100, { duration: 200 });
        opacity.value = withTiming(isVisible ? 1 : 0, { duration: 200 });
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },  // Add scale here
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[
            styles.wrapper,
            animatedStyle,
            {
                height: 70,
                borderRadius: 36,
                marginBottom: insets.bottom,
                alignSelf: 'center',  // Ensure it is centered horizontally
                marginHorizontal: 20,
            }
        ]}>
            <BlurView tint="systemChromeMaterialDark" intensity={100} style={StyleSheet.absoluteFill} />
            <View style={styles.container}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }

                        // Animate the tab bar "pop" effect
                        scale.value = withSpring(1.07, {
                            mass: 0.3,
                            stiffness: 300,
                            damping: 15,
                            velocity: 2,
                        }, () => {
                            scale.value = withSpring(1, {
                                mass: 0.3,
                                stiffness: 250,
                                damping: 18,
                                velocity: 1,
                            });
                        });
                    };

                    const icon = options.tabBarIcon({
                        color: isFocused ? activeTintColor : inactiveTintColor,
                    });

                    return (
                        <HapticTab
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={onPress}
                            style={styles.tabButton}
                        >
                            {icon}
                        </HapticTab>
                    );
                })}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 8,

    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        marginBottom: 15,
    },
});

export default CustomTabBar;
