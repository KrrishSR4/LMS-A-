import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { Card, Button } from '../../components';
import { useApp } from '../../context/AppContext';

/**
 * Student profile - edit name, phone, profile image preview.
 */
export const StudentProfileScreen = () => {
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    updateProfile({ name, phone });
    setSaving(false);
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
        <Pressable style={styles.uploadBtn}>
          <Text style={styles.uploadText}>Upload photo (preview)</Text>
        </Pressable>
      </View>

      <Card>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#94a3b8"
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
        />
        <Button title="Save" onPress={handleSave} loading={saving} style={styles.saveBtn} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: '600' },
  uploadBtn: { marginTop: 12 },
  uploadText: { color: '#2563eb', fontSize: 14 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  saveBtn: { marginTop: 20 },
});
