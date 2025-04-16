import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { useTabBarVisibility } from '../app/contexts/TabBarVisibilityContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const CustomHeader = ({ insets }: { insets: any }) => {
  const { isVisible } = useTabBarVisibility(); // or use isHeaderVisible if separate
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

    useEffect(() => {
        translateY.value = withTiming(isVisible ? 0 : -100, { duration: 150 });
        opacity.value = withTiming(isVisible ? 1 : 0, { duration: 150 });
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <ThemedText style={[styles.title, { marginTop: insets.top }]}>My Header</ThemedText>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0, // ensures it spans the full width
        height: 110,
        backgroundColor: '#151718',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        zIndex: 100,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default CustomHeader;
