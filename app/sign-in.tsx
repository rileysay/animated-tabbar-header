import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { supabase } from './utils/supabase';
import { router } from 'expo-router';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignIn() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            alert(error.message);
        } else {
            router.replace('/(tabs)/home');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
            >
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Welcome Back</Text>

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#666"
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#666"
                        style={styles.input}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => router.push('/sign-up')}
                    >
                        <Text style={styles.linkText}>
                            Don't have an account?{' '}
                            <Text style={styles.linkHighlight}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#F5F5F5',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 56,
        backgroundColor: '#1F1F1F',
        borderRadius: 14,
        paddingHorizontal: 16,
        marginBottom: 16,
        color: '#F5F5F5',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#2D2D2D',
    },
    primaryButton: {
        backgroundColor: '#6366F1',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: 16,
        fontWeight: '600',
    },
    linkContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    linkText: {
        color: '#8A8A8A',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#6366F1',
        fontWeight: '600',
    },
});