import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTabBarVisibility } from '../contexts/TabBarVisibilityContext';
import CustomTabBar from '../../components/CustomTabBar';
import { Image } from 'expo-image';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isVisible } = useTabBarVisibility();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          activeTintColor={Colors[colorScheme ?? 'light'].tint}
          inactiveTintColor={Colors[colorScheme ?? 'light'].tabBarInactiveTint}
        />
      )}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/images/Home.svg") 
                  : require("../../assets/images/Home.svg") 
              }
              style={{
                width: 25,
                height: 25,
                tintColor: color, 
              }}
            />
          )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gpt"
        options={{
          headerShown: true,

          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
