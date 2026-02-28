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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
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
    const { setRole, trackLogin } = useApp();
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
            console.log('Bhai, OTP bhej rahe hain target:', `+91${phone}`);
            const phoneProvider = new PhoneAuthProvider(auth);
            const vId = await phoneProvider.verifyPhoneNumber(
                `+91${phone}`,
                recaptchaVerifier.current
            );
            setVerificationId(vId);
            setStep('otp');
            console.log('OTP request successful. vId:', vId);
            Alert.alert('Success', 'Verification code sent!');
        } catch (error) {
            console.error('Phone Login Error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email aur Password dono bhariye bhai');
            return;
        }
        setLoading(true);
        try {
            let userObj;
            if (emailMode === 'signup') {
                console.log('Registering user:', email);
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                userObj = cred.user;
                // Bhai, Firebase profile mein bhi name save kar dete hain
                await updateProfile(userObj, { displayName: fullName });
                Alert.alert('Success', 'Account ban gaya bhai! Ab aap login ho gaye hain.');
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
            if (error.code === 'auth/invalid-credential') msg = 'Email ya Password galat hai.';
            if (error.code === 'auth/email-already-in-use') msg = 'Ye email pehle se registered hai bhai.';
            if (error.code === 'auth/weak-password') msg = 'Password thoda strong rakho (min 6 chars).';

            Alert.alert('Auth Failed', msg);
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

            // Bhai, agar name diya hai toh Firebase mein update kar do
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
            style={styles.container}
        >
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseApp.options}
                // Bhai, isko thoda simple rakhte hain taaki error samajh aaye
                title="Verify you are human"
                cancelLabel="Close"
            />

            <View style={styles.bgDecoration} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={logoAsset}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Road To A+</Text>
                    <Text style={styles.subtitle}>
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
                                <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name (for display)"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
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
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleEmailAuth}
                                disabled={loading}
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

                            {step === 'phone' && (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Full Name (for display)"
                                        value={fullName}
                                        onChangeText={setFullName}
                                        autoCapitalize="words"
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
                        </>
                    )}

                    {step === 'otp' && loginMode === 'phone' && (
                        <Pressable style={styles.resendBtn} onPress={() => setStep('phone')}>
                            <Text style={styles.resendText}>Change Phone Number</Text>
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
                        <Text style={styles.dividerText}>SECURE LOGIN</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Text style={styles.infoText}>
                        Bhai, security ke liye specific admin credentials hi access rakhenge.
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
        marginBottom: 30,
    },
    logoContainer: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoImage: {
        width: 140,
        height: 140,
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
    resendBtn: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    resendText: {
        color: '#2563eb',
        fontSize: 14,
        fontWeight: '600',
    },
    switchModeBtn: {
        marginTop: 15,
        alignItems: 'center',
        paddingVertical: 10,
    },
    switchModeText: {
        color: '#2563eb',
        fontSize: 15,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    subSwitchBtn: {
        marginTop: 15,
        alignItems: 'center',
    },
    subSwitchText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    eyeBtn: {
        padding: 5,
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
