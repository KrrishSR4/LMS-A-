import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { Card } from '../../components';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Admin dashboard - overview stats and quick actions.
 */
export const AdminDashboardScreen = ({ navigation }) => {
  const { groups, pendingStudents, groupMembers, broadcastMessage } = useApp();
  const [showBroadcast, setShowBroadcast] = React.useState(false);
  const [broadcastText, setBroadcastText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const uniqueStudentIds = new Set(Object.values(groupMembers || {}).flat());
  const pending = pendingStudents?.length || 0;

  const handleBroadcast = () => {
    if (!broadcastText.trim()) return;
    setLoading(true);
    // Simulate slight delay for premium feel
    setTimeout(() => {
      broadcastMessage({
        type: 'announcement',
        senderId: 'admin',
        senderName: 'Admin',
        text: broadcastText.trim(),
        pinned: true,
      });
      setLoading(false);
      setBroadcastText('');
      setShowBroadcast(false);
      Alert.alert('Success', 'Broadcast sent to all groups!');
    }, 800);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerBackground}>
          <Text style={styles.welcomeText}>Admin Management</Text>
          <Text style={styles.headerSub}>Everything looks great today! ✨</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: '#fdf4ff' }]}>
              <View style={[styles.statIconBg, { backgroundColor: '#fae8ff' }]}>
                <Ionicons name="apps" size={24} color="#a21caf" />
              </View>
              <View>
                <Text style={styles.statValue}>{groups?.length || 0}</Text>
                <Text style={styles.statLabel}>Groups</Text>
              </View>
            </View>
            <View style={[styles.statItem, { backgroundColor: '#f0fdf4' }]}>
              <View style={[styles.statIconBg, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="people" size={24} color="#15803d" />
              </View>
              <View>
                <Text style={styles.statValue}>{uniqueStudentIds.size}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
            </View>
            <View style={[styles.statItem, { backgroundColor: '#fff7ed' }]}>
              <View style={[styles.statIconBg, { backgroundColor: '#ffedd5' }]}>
                <Ionicons name="time" size={24} color="#c2410c" />
              </View>
              <View>
                <Text style={styles.statValue}>{pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Pressable
            style={[styles.actionCard, { backgroundColor: '#eff6ff' }]}
            onPress={() => navigation.navigate('StudentApproval')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="person-add" size={24} color="#2563eb" />
            </View>
            <Text style={styles.actionTitle}>Approvals</Text>
            <Text style={styles.actionSubtitle}>{pending} waiting</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: '#f5f3ff' }]}
            onPress={() => navigation.navigate('GroupManagement')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="layers" size={24} color="#7c3aed" />
            </View>
            <Text style={styles.actionTitle}>New Group</Text>
            <Text style={styles.actionSubtitle}>Add more units</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: '#fff7ed' }]}
            onPress={() => setShowBroadcast(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ffedd5' }]}>
              <Ionicons name="megaphone" size={24} color="#ea580c" />
            </View>
            <Text style={styles.actionTitle}>Broadcast</Text>
            <Text style={styles.actionSubtitle}>Send notifications</Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, { backgroundColor: '#f0fdf4' }]}
            onPress={() => navigation.navigate('AdminFees')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="wallet" size={24} color="#15803d" />
            </View>
            <Text style={styles.actionTitle}>Fees</Text>
            <Text style={styles.actionSubtitle}>Records & Bank</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Groups List</Text>
        {groups?.map((g) => (
          <Card
            key={g.id}
            onPress={() => navigation.navigate('GroupChat', { groupId: g.id, groupName: g.name })}
            style={styles.groupCard}
          >
            <View style={styles.groupCardContent}>
              <View style={styles.groupIconContainer}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#64748b" />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{g.name}</Text>
                <Text style={styles.groupMeta}>
                  {(groupMembers[g.id] || []).length} members
                </Text>
              </View>
              <Ionicons name="arrow-forward-circle-outline" size={24} color="#2563eb" />
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Broadcast Modal */}
      <Modal visible={showBroadcast} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowBroadcast(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconBg, { backgroundColor: '#ffedd5' }]}>
                <Ionicons name="megaphone" size={24} color="#ea580c" />
              </View>
              <Text style={styles.modalTitle}>Global Broadcast</Text>
            </View>
            <Text style={styles.modalDesc}>This message will be pinned in ALL student groups.</Text>

            <TextInput
              style={styles.broadcastInput}
              placeholder="Type your announcement here..."
              placeholderTextColor="#94a3b8"
              multiline
              value={broadcastText}
              onChangeText={setBroadcastText}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowBroadcast(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.sendBtn, !broadcastText.trim() && { opacity: 0.6 }]}
                onPress={handleBroadcast}
                disabled={!broadcastText.trim() || loading}
              >
                <Text style={styles.sendBtnText}>{loading ? 'Sending...' : 'Send Now'}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  content: { paddingBottom: 32 },
  headerBackground: {
    backgroundColor: '#2563eb',
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
  },
  statsContainer: {
    marginTop: -40,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#64748b', marginTop: 2 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: (Dimensions.get('window').width - 32 - 12) / 2, // 2 columns
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  groupCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#fff',
    elevation: 2,
  },
  groupCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  groupInfo: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  groupMeta: { fontSize: 13, color: '#64748b', marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  modalIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    fontWeight: '500',
  },
  broadcastInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: '#ea580c',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
