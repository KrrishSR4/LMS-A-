import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Dimensions, StatusBar } from 'react-native';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Entry screen - choose Admin or Student demo mode.
 * Features vibrant role-based cards and smooth animations.
 */
export const EntryScreen = ({ navigation }) => {
  const { setRole } = useApp();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const adminScale = useRef(new Animated.Value(1)).current;
  const studentScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const enterAsAdmin = () => {
    setRole('admin');
    navigation.replace('App');
  };

  const enterAsStudent = () => {
    setRole('student');
    navigation.replace('App');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgDecoration} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Ionicons name="school" size={40} color="#fff" />
          </View>
          <Text style={styles.title}>LMS Expo</Text>
          <Text style={styles.subtitle}>Unlock Your Potential with Our Modern Learning Platform</Text>
        </View>

        <View style={styles.cardContainer}>
          <Animated.View style={{ transform: [{ scale: adminScale }] }}>
            <Pressable
              onPressIn={() => handlePressIn(adminScale)}
              onPressOut={() => handlePressOut(adminScale)}
              onPress={enterAsAdmin}
              style={[styles.roleCard, styles.adminCard]}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="shield-checkmark" size={32} color="#2563eb" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.roleTitle}>Admin Demo</Text>
                <Text style={styles.roleDesc}>Manage groups, approve students, and broadcast notices.</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#2563eb" />
            </Pressable>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: studentScale }] }}>
            <Pressable
              onPressIn={() => handlePressIn(studentScale)}
              onPressOut={() => handlePressOut(studentScale)}
              onPress={enterAsStudent}
              style={[styles.roleCard, styles.studentCard]}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#f5f3ff' }]}>
                <Ionicons name="book-outline" size={32} color="#7c3aed" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.roleTitle}>Student Demo</Text>
                <Text style={styles.roleDesc}>Access your groups, chat with faculty, and get updates.</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#7c3aed" />
            </Pressable>
          </Animated.View>
        </View>

        <Text style={styles.footerText}>Version 1.0.2 • Powered by Expo</Text>
      </Animated.View>
    </View>
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
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
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
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  cardContainer: {
    gap: 20,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  adminCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#2563eb',
  },
  studentCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#7c3aed',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  roleDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
});
