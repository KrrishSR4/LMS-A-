import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Card } from '../../components';

export const AboutScreen = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Image
                    source={require('../../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>Road To A+</Text>
                <Text style={styles.version}>Version 1.0.2</Text>
            </View>

            <Card style={styles.card}>
                <Text style={styles.title}>Welcome to Road To A+</Text>
                <Text style={styles.description}>
                    Road To A+ is a premium Learning Management System designed to bridge the gap between students and educators.
                    Our mission is to provide a seamless, interactive, and efficient platform for academic excellence.
                </Text>
            </Card>

            <Card style={styles.card}>
                <Text style={styles.sectionTitle}>Key Features</Text>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>Real-time Group Discussions</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>Seamless Fee Management</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>Student Performance Tracking</Text>
                </View>
                <View style={styles.featureItem}>
                    <Text style={styles.featureBullet}>•</Text>
                    <Text style={styles.featureText}>Interactive Learning Resources</Text>
                </View>
            </Card>

            <Text style={styles.footer}>© 2026 Road To A+. All rights reserved.</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20 },
    header: { alignItems: 'center', marginBottom: 30 },
    logo: { width: 100, height: 100, borderRadius: 20 },
    appName: { fontSize: 28, fontWeight: '900', color: '#1e293b', marginTop: 15 },
    version: { fontSize: 14, color: '#64748b', marginTop: 5 },
    card: { padding: 20, marginBottom: 20, borderRadius: 20 },
    title: { fontSize: 18, fontWeight: '800', color: '#2563eb', marginBottom: 12 },
    description: { fontSize: 15, color: '#475569', lineHeight: 22 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 15 },
    featureItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
    featureBullet: { fontSize: 16, color: '#2563eb', marginRight: 10, fontWeight: 'bold' },
    featureText: { fontSize: 15, color: '#475569' },
    footer: { textAlign: 'center', marginTop: 20, color: '#94a3b8', fontSize: 12 },
});
