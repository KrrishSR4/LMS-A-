import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

export const PhoneLoginScreen = ({ navigation }) => {
    const { setRole } = useApp();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: `+91${phone}`, // Assuming India for now
            });

            if (error) throw error;
            setStep('otp');
            Alert.alert('Success', 'Verification code sent!');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: `+91${phone}`,
                token: otp,
                type: 'sms',
            });

            if (error) throw error;

            // In a real app, you'd check profile role from metadata or profiles table
            // For now, let's ask or assume based on user preference or a prompt
            Alert.alert('Success', 'Logged in successfully!', [
                {
                    text: 'Continue',
                    onPress: () => {
                        // For simplicity, let's go to role selection (Entry) or decide here
                        setRole('student');
                        navigation.replace('App');
                    }
                }
            ]);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.bgDecoration} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoIcon}>
                        {/* 
                          Bhai, logo.png abhi missing hai isliye app crash ho rhi thi.
                          Maine default icon vapas laga diya hai fallback ke liye.
                          Jaise hi aap logo.png assets folder me dalेंगे, ye image dikhne lagegi.
                        */}
                        <Image
                            source={{ uri: 'https://placehold.co/400x400/2563eb/ffffff?text=LMS' }}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>{step === 'phone' ? 'Phone Login' : 'Verify OTP'}</Text>
                    <Text style={styles.subtitle}>
                        {step === 'phone'
                            ? 'Enter your phone number to receive a verification code'
                            : `Enter the code sent to +91 ${phone}`}
                    </Text>
                </View>

                <View style={styles.form}>
                    {step === 'phone' ? (
                        <View style={styles.inputContainer}>
                            <View style={styles.countryCode}>
                                <Text style={styles.countryText}>+91</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                maxLength={10}
                            />
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="6-digit Code"
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={6}
                            />
                        </View>
                    )}

                    <Pressable
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>{step === 'phone' ? 'Send OTP' : 'Verify & Login'}</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </Pressable>

                    {step === 'otp' && (
                        <Pressable style={styles.resendBtn} onPress={() => setStep('phone')}>
                            <Text style={styles.resendText}>Change Phone Number</Text>
                        </Pressable>
                    )}

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Pressable
                        style={styles.guestButton}
                        onPress={() => {
                            setRole('student');
                            navigation.replace('App');
                        }}
                    >
                        <Text style={styles.guestButtonText}>Try Demo Mode (Bypass Auth)</Text>
                    </Pressable>

                    <Text style={styles.infoText}>
                        Note: If you get "unsupported phone provider", please enable "Phone" in Supabase Auth Dashboard.
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bgDecoration: {
        position: 'absolute',
        top: -width * 0.2,
        right: -width * 0.2,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: '#eff6ff',
        zIndex: -1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    logoImage: {
        width: 80,
        height: 80,
        borderRadius: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        height: 60,
        marginBottom: 20,
    },
    countryCode: {
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        marginRight: 12,
    },
    countryText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#2563eb',
        height: 60,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
    },
    guestButton: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    guestButtonText: {
        color: '#475569',
        fontSize: 16,
        fontWeight: '700',
    },
    infoText: {
        marginTop: 24,
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 18,
    },
});
