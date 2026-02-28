import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert } from 'react-native';
import { Button, Card } from '../../components';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export const ProfileDetailScreen = ({ navigation }) => {
    const { profile, updateProfile } = useApp();
    const [name, setName] = useState(profile?.name || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ name, phone });
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleRemovePFP = () => {
        Alert.alert(
            'Remove Photo',
            'Are you sure you want to remove your profile photo?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => updateProfile({ avatar: null }) },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    {profile?.avatar ? (
                        <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
                    ) : (
                        <Text style={styles.avatarText}>
                            {(profile?.name || 'S').charAt(0).toUpperCase()}
                        </Text>
                    )}
                </View>
                <View style={styles.avatarActions}>
                    <Pressable style={styles.actionBtn}>
                        <Text style={styles.actionText}>Change Photo</Text>
                    </Pressable>
                    {profile?.avatar && (
                        <Pressable style={[styles.actionBtn, styles.removeBtn]} onPress={handleRemovePFP}>
                            <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <Card style={styles.card}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+91 00000 00000"
                        keyboardType="phone-pad"
                    />
                </View>

                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    loading={saving}
                    style={styles.saveBtn}
                />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20 },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    avatarImg: { width: 120, height: 120, borderRadius: 60 },
    avatarText: { fontSize: 48, color: '#fff', fontWeight: 'bold' },
    avatarActions: { flexDirection: 'row', marginTop: 15, gap: 15 },
    actionBtn: { paddingVertical: 8, paddingHorizontal: 16 },
    actionText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
    removeText: { color: '#ef4444' },
    card: { padding: 20, borderRadius: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    saveBtn: { marginTop: 10, borderRadius: 12 },
});
