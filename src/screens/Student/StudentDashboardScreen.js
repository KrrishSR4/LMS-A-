import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Card } from '../../components';
import { LiveLectureBanner } from '../../components/chat/LiveLectureBanner';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Student dashboard - joined groups, live lecture, announcements.
 */
export const StudentDashboardScreen = ({ navigation }) => {
  const { groups, groupMembers, profile, messages, liveLecture, fees, theme } = useApp();

  const displayGroups =
    groups?.filter((g) => (groupMembers[g.id] || []).includes(profile?.id || 'current_user')) || groups || [];

  const pinnedAnnouncements = [];
  displayGroups.forEach((g) => {
    const msgs = (messages[g.id] || []).filter((m) => m.pinned || m.type === 'announcement');
    msgs.forEach((m) => pinnedAnnouncements.push({ ...m, groupName: g.name }));
  });
  pinnedAnnouncements.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, {profile?.name || 'Student'} 👋</Text>
          <Text style={styles.welcomeSub}>How is your day going? Ready to study?</Text>
        </View>
        <Pressable style={[styles.profileIndicator, { backgroundColor: theme.primary, borderColor: theme.primary + '30' }]}>
          <Text style={styles.profileText}>{profile?.name?.charAt(0) || 'S'}</Text>
        </Pressable>
      </View>

      {/* Fee Alert Banner */}
      {fees[profile?.id || 'current_user']?.status !== 'paid' && (
        <Pressable
          style={styles.feeBanner}
          onPress={() => navigation.navigate('StudentFees')}
        >
          <View style={styles.feeContent}>
            <View style={styles.feeIconBg}>
              <Ionicons name="wallet-outline" size={20} color="#92400e" />
            </View>
            <View>
              <Text style={styles.feeTitle}>Pending Fees Found</Text>
              <Text style={styles.feeSubTitle}>Please pay your monthly installment</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#92400e" />
        </Pressable>
      )}

      {liveLecture?.active && <LiveLectureBanner lecture={liveLecture} />}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Groups</Text>
        <Pressable><Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupsScroll} contentContainerStyle={{ paddingRight: 20 }}>
        {displayGroups.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.empty}>No groups joined yet</Text>
          </View>
        ) : (
          displayGroups.map((g, index) => (
            <Pressable
              key={g.id}
              style={[styles.groupCard, { backgroundColor: index % 2 === 0 ? '#eff6ff' : '#f0fdf4' }]}
              onPress={() => navigation.navigate('StudentGroupChat', { groupId: g.id, groupName: g.name })}
            >
              <View style={[styles.groupIconBg, { backgroundColor: index % 2 === 0 ? '#dbeafe' : '#dcfce7' }]}>
                <Ionicons name="journal" size={26} color={index % 2 === 0 ? '#2563eb' : '#15803d'} />
              </View>
              <Text style={styles.groupName} numberOfLines={1}>{g.name}</Text>
              <Text style={styles.groupMeta}>Interactive Class</Text>
              <View style={[styles.goBtn, { backgroundColor: theme.primary }]}>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent Announcements</Text>
      {pinnedAnnouncements.length === 0 ? (
        <Card style={styles.emptyAnnCard}>
          <Ionicons name="megaphone-outline" size={32} color="#cbd5e1" />
          <Text style={styles.emptyAnn}>Stay tuned for updates!</Text>
        </Card>
      ) : (
        pinnedAnnouncements.slice(0, 3).map((m) => (
          <Pressable key={m.id} style={styles.announCard}>
            <View style={[styles.announIndicator, { backgroundColor: theme.primary }]} />
            <View style={styles.announContent}>
              <Text style={[styles.annGroup, { color: theme.primary }]}>{m.groupName}</Text>
              <Text style={styles.annText} numberOfLines={2}>{m.text}</Text>
              <Text style={styles.annDate}>Today, 10:30 AM</Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeText: { fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  welcomeSub: { fontSize: 16, color: '#64748b', marginTop: 6, fontWeight: '600', letterSpacing: 0.1 },
  profileIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  profileText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#1e293b', letterSpacing: -0.2 },
  seeAll: { fontSize: 15, color: '#2563eb', fontWeight: '800' },
  groupsScroll: { paddingLeft: 24, marginBottom: 32 },
  groupCard: {
    width: 160,
    borderRadius: 28,
    padding: 20,
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupIconBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupName: { fontSize: 17, fontWeight: '800', color: '#1e293b' },
  groupMeta: { fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: '600' },
  goBtn: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: { padding: 40, alignItems: 'center' },
  empty: { color: '#64748b', textAlign: 'center', fontWeight: '500' },
  announCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  announIndicator: {
    width: 5,
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
    marginRight: 16,
  },
  announContent: { flex: 1 },
  annGroup: { fontSize: 13, fontWeight: '800', color: '#2563eb', marginBottom: 4 },
  annText: { fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500' },
  annDate: { fontSize: 12, color: '#94a3b8', marginTop: 8, fontWeight: '600' },
  emptyAnnCard: {
    marginHorizontal: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 24,
  },
  emptyAnn: { marginTop: 12, color: '#64748b', fontWeight: '600' },
  feeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fffbeb',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  feeContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  feeIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  feeTitle: { fontSize: 16, fontWeight: '800', color: '#92400e' },
  feeSubTitle: { fontSize: 12, color: '#b45309', fontWeight: '500' },
});
