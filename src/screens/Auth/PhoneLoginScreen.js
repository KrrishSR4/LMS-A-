import React, { useState, useRef } from 'react';
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
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'; // Deprecated in SDK 54
import { auth } from '../../services/firebase';
import {
    PhoneAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { useApp } from '../../context/AppContext';
import firebaseApp from '../../services/firebase';
import { checkAdmin } from '../../utils/helpers';

const logoAsset = require('../../../assets/logo.png');
const { width } = Dimensions.get('window');

export const PhoneLoginScreen = ({ navigation }) => {
    const { setRole, trackLogin, theme } = useApp();
    const [loginMode, setLoginMode] = useState('phone'); // 'phone' | 'email'
    const [emailMode, setEmailMode] = useState('login'); // 'login' | 'signup'
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [loading, setLoading] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending OTP to:', `+91${phone}`);
            // Note: expo-firebase-recaptcha is deprecated in SDK 54.
            // Using a mock verification ID for demonstration purposes.
            const vId = "mock_verification_id";
            setVerificationId(vId);
            setStep('otp');
            console.log('OTP request mocked. verificationId:', vId);
            Alert.alert('Success', 'Verification code sent!');
        } catch (error) {
            console.error('Phone Login Error:', error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both Email and Password');
            return;
        }
        setLoading(true);
        try {
            let userObj;
            if (emailMode === 'signup') {
                console.log('Registering user:', email);
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                userObj = cred.user;
                await updateProfile(userObj, { displayName: fullName });
                Alert.alert('Success', 'Account created successfully! You are now logged in.');
            } else {
                console.log('Logging in user:', email);
                const cred = await signInWithEmailAndPassword(auth, email, password);
                userObj = cred.user;
            }

            const isAdmin = checkAdmin(email);
            const userRole = isAdmin ? 'admin' : 'student';
            setRole(userRole);

            trackLogin({
                name: emailMode === 'signup' ? fullName : (userObj.displayName || email),
                email,
                role: userRole,
                id: userObj.uid
            });
        } catch (error) {
            console.error('Email Auth Error:', error);
            let msg = error.message;
            if (error.code === 'auth/invalid-credential') msg = 'Invalid Email or Password.';
            if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
            if (error.code === 'auth/weak-password') msg = 'Password is too weak (min 6 characters).';

            Alert.alert('Authentication Failed', msg);
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
            const credential = PhoneAuthProvider.credential(verificationId, otp);
            const userCred = await signInWithCredential(auth, credential);

            const identifier = phone || userCred.user.phoneNumber || userCred.user.uid;
            const isAdmin = checkAdmin(identifier);
            const userRole = isAdmin ? 'admin' : 'student';
            setRole(userRole);

            if (fullName) {
                await updateProfile(userCred.user, { displayName: fullName });
            }

            trackLogin({
                name: fullName || userCred.user.displayName || phone,
                phone,
                role: userRole,
                id: userCred.user.uid
            });

            Alert.alert('Success', 'Logged in successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.secondary || '#F8FAFC' }]}
        >
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={[theme.secondary || '#F8FAFC', '#FFFFFF', theme.secondary || '#DBEAFE']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Background Blobs */}
            <View style={[styles.blob, styles.blob1, { backgroundColor: theme.primary, opacity: 0.1 }]} />
            <View style={[styles.blob, styles.blob2, { backgroundColor: theme.primary, opacity: 0.05 }]} />
            <View style={[styles.blob, styles.blob3, { backgroundColor: theme.primary, opacity: 0.08 }]} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { shadowColor: theme.primary }]}>
                        <Image
                            source={logoAsset}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: theme.text || '#1E293B' }]}>Road To A+</Text>
                    <Text style={[styles.subtitle, { color: theme.text || '#64748B', opacity: 0.7 }]}>
                        {loginMode === 'email'
                            ? (emailMode === 'signup' ? 'Create your account' : 'Login to your account')
                            : (step === 'phone'
                                ? 'Enter your phone number'
                                : `Enter the code sent to +91 ${phone}`)}
                    </Text>
                </View>

                <View style={styles.form}>
                    {loginMode === 'email' ? (
                        <>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={theme.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name (for display)"
                                    placeholderTextColor="#94a3b8"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                    autoComplete="name"
                                    textContentType="name"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={theme.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password"
                                    textContentType="password"
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#64748b"
                                    />
                                </Pressable>
                            </View>

                            <Pressable
                                style={[styles.button, loading && styles.buttonDisabled, { shadowColor: theme.primary }]}
                                onPress={handleEmailAuth}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[theme.primary, theme.primary + 'CC']} // Adding some transparency for gradient if possible, or just theme.primary
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>
                                                {emailMode === 'signup' ? 'Register Now' : 'Login with Email'}
                                            </Text>
                                            <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                        </>
                                    )}
                                </LinearGradient>
                            </Pressable>

                            <Pressable
                                style={styles.subSwitchBtn}
                                onPress={() => setEmailMode(emailMode === 'login' ? 'signup' : 'login')}
                            >
                                <Text style={styles.subSwitchText}>
                                    {emailMode === 'login' ? "Don't have an account? Signup" : "Already have an account? Login"}
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            {step === 'phone' ? (
                                <View style={styles.inputContainer}>
                                    <View style={styles.countryCode}>
                                        <Text style={[styles.countryText, { color: theme.text }]}>+91</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone Number"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                        maxLength={10}
                                        autoComplete="tel"
                                        textContentType="telephoneNumber"
                                    />
                                </View>
                            ) : (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="key-outline" size={20} color={theme.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="6-digit Code"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="number-pad"
                                        value={otp}
                                        onChangeText={setOtp}
                                        maxLength={6}
                                        autoComplete="one-time-code"
                                        textContentType="oneTimeCode"
                                    />
                                </View>
                            )}

                            {step === 'phone' && (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color={theme.primary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Full Name (for display)"
                                        placeholderTextColor="#94a3b8"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        textContentType="name"
                                    />
                                </View>
                            )}

                            <Pressable
                                style={[styles.button, loading && styles.buttonDisabled, { shadowColor: theme.primary }]}
                                onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[theme.primary, theme.primary + 'DD']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>{step === 'phone' ? 'Send OTP' : 'Verify & Login'}</Text>
                                            <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                        </>
                                    )}
                                </LinearGradient>
                            </Pressable>
                        </>
                    )}

                    {step === 'otp' && loginMode === 'phone' && (
                        <Pressable style={styles.resendBtn} onPress={() => setStep('phone')}>
                            <Text style={[styles.resendText, { color: theme.primary }]}>Change Phone Number</Text>
                        </Pressable>
                    )}

                    <Pressable
                        style={styles.switchModeBtn}
                        onPress={() => {
                            setLoginMode(loginMode === 'phone' ? 'email' : 'phone');
                            setStep('phone');
                        }}
                    >
                        <Text style={styles.switchModeText}>
                            {loginMode === 'phone' ? 'Use Email & Password' : 'Use Phone Number'}
                        </Text>
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>SECURE ACCESS</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Text style={styles.infoText}>
                        Access is restricted to verified students and administrators for maximum security.
                    </Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        borderRadius: 1000,
        zIndex: 0,
    },
    blob1: {
        width: width * 1.5,
        height: width * 1.5,
        top: -width * 0.8,
        right: -width * 0.5,
    },
    blob2: {
        width: width * 0.8,
        height: width * 0.8,
        bottom: -width * 0.2,
        left: -width * 0.3,
    },
    blob3: {
        width: width * 0.5,
        height: width * 0.5,
        top: width * 0.4,
        left: -width * 0.1,
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
    logoContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 30,
        elevation: 15,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    logoImage: {
        width: 70,
        height: 70,
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        lineHeight: 22,
        fontWeight: '600',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        height: 64,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    countryCode: {
        paddingRight: 12,
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
        marginRight: 12,
    },
    countryText: {
        fontSize: 16,
        fontWeight: '700',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
    },
    button: {
        height: 64,
        borderRadius: 22,
        marginTop: 8,
        elevation: 10,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#94A3B8',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
    },
    resendBtn: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '800',
    },
    switchModeBtn: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    switchModeText: {
        color: '#475569',
        fontSize: 15,
        fontWeight: '800',
    },
    subSwitchBtn: {
        marginTop: 16,
        alignItems: 'center',
    },
    subSwitchText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '700',
    },
    eyeBtn: {
        padding: 8,
    },
    infoText: {
        marginTop: 32,
        fontSize: 12,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 20,
        fontWeight: '600',
    },
});


