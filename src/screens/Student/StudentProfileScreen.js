import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export const StudentProfileScreen = ({ navigation }) => {
  const { profile, logout } = useApp();

  const MenuItem = ({ icon, title, subtitle, onPress, color = '#1e293b' }) => (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>
              {(profile?.name || 'S').charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <Text style={styles.userName}>{profile?.name || 'User Name'}</Text>
        <Text style={styles.userPhone}>{profile?.phone || '+91 00000 00000'}</Text>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionLabel}>Account Settings</Text>
        <MenuItem
          icon="person-outline"
          title="Profile"
          subtitle="Name, Phone, Profile Picture"
          onPress={() => navigation.navigate('ProfileDetail')}
          color="#2563eb"
        />
        <MenuItem
          icon="color-palette-outline"
          title="Themes"
          subtitle="Customize app colors"
          onPress={() => navigation.navigate('Theme')}
          color="#8b5cf6"
        />
        <MenuItem
          icon="information-circle-outline"
          title="About"
          subtitle="About Road To A+"
          onPress={() => navigation.navigate('About')}
          color="#0ea5e9"
        />
      </View>

      <View style={styles.logoutSection}>
        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
        <Text style={styles.versionText}>Version 1.0.2</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 40 },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarImg: { width: 80, height: 80, borderRadius: 40 },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  userName: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  userPhone: { fontSize: 14, color: '#64748b', marginTop: 4 },
  menuSection: { marginTop: 25, paddingHorizontal: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  menuSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  logoutSection: { marginTop: 30, alignItems: 'center', paddingHorizontal: 16 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
  versionText: { marginTop: 15, color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
});
