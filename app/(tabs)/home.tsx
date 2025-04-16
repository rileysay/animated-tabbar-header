import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '../utils/supabase';
import { router } from 'expo-router';
import { useTabBarVisibility } from '../contexts/TabBarVisibilityContext';
import CustomHeader from '@/components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MasonryFlashList } from '@shopify/flash-list';

export default function HomeScreen() {
  const { setIsVisible } = useTabBarVisibility();
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [atTop, setAtTop] = useState(true);


  const data = React.useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      height: Math.floor(Math.random() * 150) + 150,
    })),
    []); //

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const scrollingDown = currentOffset > scrollPosition && currentOffset > 50;
    setScrollPosition(currentOffset);
    setIsVisible(!scrollingDown);
  };

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Error signing out: ' + error.message);
    } else {
      router.replace('/sign-in');
    }
  }

  const HEADER_HEIGHT = 110;

  return (
    <View style={styles.container}>
      <CustomHeader insets={insets} />
      <MasonryFlashList
        data={data}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={200}
        numColumns={2} // Set number of columns
        renderItem={({ item, index }) => {
          const isLeftColumn = index % 2 === 0;
          return (
            <ThemedView
              style={[
                styles.square,
                {
                  height: item.height,
                  backgroundColor: `hsl(${index * 50 % 360}, 70%, 80%)`,
                  marginRight: isLeftColumn ? 4 : 0,
                  marginLeft: isLeftColumn ? 0 : 4,
                },
              ]}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        contentContainerStyle={{
          paddingTop: atTop ? HEADER_HEIGHT : 0,
        }}
        scrollEventThrottle={16}
        ListFooterComponent={
          <View style={styles.signOutContainer}>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    marginBottom: 8, // Add bottom margin only
    borderRadius: 8,
  },
  signOutContainer: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});