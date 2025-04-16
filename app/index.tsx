import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from './utils/supabase';
import { router } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LottieView from 'lottie-react-native';

export default function Home() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Check for current session on component mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                router.replace('/(tabs)/home'); // Redirect if session exists
            }
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                router.replace('/(tabs)/home'); // Redirect on login
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <LottieView
                    source={require('../assets/images/Chair.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300, alignSelf: 'center' }}
                />
                <ThemedText style={styles.title}>Welcome{session ? ' Back' : ''}!</ThemedText>
                <Text style={styles.subtitle}>
                    {session ? "You're all set to continue your journey" : "Get started with your account"}
                </Text>
            </View>

            <View style={styles.bottomContainer}>
                {session ? (
                    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => router.push('/sign-in')}
                        >
                            <Text style={styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => router.push('/sign-up')}
                        >
                            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create Account</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    bottomContainer: {
        paddingBottom: 48,
        gap: 12,
    },
    button: {
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButton: {
        backgroundColor: '#6366F1',
    },
    secondaryButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    secondaryButtonText: {
        color: '#1F2937',
    },
});