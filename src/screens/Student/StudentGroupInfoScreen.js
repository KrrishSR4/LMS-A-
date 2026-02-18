import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../../components';
import { useApp } from '../../context/AppContext';

/**
 * Group info - classmates list and rules.
 */
export const StudentGroupInfoScreen = ({ route }) => {
  const { groupId, groupName } = route.params || {};
  const { groupMembers, students } = useApp();
  const members = groupMembers[groupId] || [];

  const RULES = [
    'Be respectful to everyone',
    'No spam or unrelated content',
    'Follow instructor guidelines',
    'Ask doubts in the group',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Classmates</Text>
      {members.map((id) => {
        const s = students[id] || { id, name: 'Unknown', phone: '' };
        return (
          <Card key={id}>
            <View style={styles.memberRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(s.name || '?').charAt(0)}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{s.name}</Text>
                <Text style={styles.memberPhone}>{s.phone}</Text>
              </View>
            </View>
          </Card>
        );
      })}

      <Text style={styles.sectionTitle}>Group Rules</Text>
      <Card>
        {RULES.map((r, i) => (
          <Text key={i} style={styles.rule}>
            • {r}
          </Text>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 12,
  },
  memberRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '600', color: '#64748b' },
  memberInfo: { marginLeft: 14, flex: 1 },
  memberName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  memberPhone: { fontSize: 14, color: '#64748b', marginTop: 2 },
  rule: { fontSize: 14, color: '#475569', marginBottom: 8 },
});
