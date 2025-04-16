import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const GPT4OVision = () => {
    const [images, setImages] = useState<string[]>([]);
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: false,
        });

        if (!result.canceled && result.assets) {
            setImages(prev => [...prev, result.assets[0].uri].slice(0, 2));
        }
    };

    const convertImageToBase64 = async (uri: string) => {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            throw new Error('File does not exist');
        }
        if (!fileInfo.exists) {
            throw new Error('File does not exist');
        }
        if (fileInfo.size > 20 * 1024 * 1024) {
            throw new Error('Image size exceeds 20MB limit');
        }

        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return `data:image/jpeg;base64,${base64}`;
    };

    const analyzeImages = async () => {
        if (images.length !== 2) return;

        setLoading(true);
        setResult('');
        try {
            const image1 = await convertImageToBase64(images[0]);
            const image2 = await convertImageToBase64(images[1]);

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ``
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [{
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "What do these two images have in common? Combine the information from both images and provide a comprehensive analysis."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image1,
                                    detail: "auto"
                                }
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image2,
                                    detail: "auto"
                                }
                            }
                        ]
                    }],
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();

            if (!data?.choices?.[0]?.message?.content) {
                throw new Error('Invalid API response structure');
            }

            setResult(data.choices[0].message.content);
        } catch (error) {
            console.error('API Error:', error);
            setResult(error instanceof Error ? error.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Two Images</Text>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </View>

            {images.length === 2 && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={analyzeImages}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Processing...' : 'Analyze Images'}
                    </Text>
                </TouchableOpacity>
            )}

            {loading && <ActivityIndicator size="large" />}

            {result ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{result}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    resultText: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default GPT4OVision;
