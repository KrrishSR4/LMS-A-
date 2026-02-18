import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { Card } from '../../components';
import { useApp } from '../../context/AppContext';

/**
 * Admin - group settings toggles.
 */
export const AdminGroupSettingsScreen = ({ route, navigation }) => {
  const { groupId, groupName } = route.params || {};
  const { settings, updateGroupSettings } = useApp();
  const s = settings[groupId] || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{groupName}</Text>
      <Text style={styles.subtitle}>Group settings</Text>

      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Allow student messages</Text>
          <Switch
            value={s.allowStudentMessages ?? true}
            onValueChange={(v) => updateGroupSettings(groupId, 'allowStudentMessages', v)}
            trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
            thumbColor={s.allowStudentMessages ? '#2563eb' : '#94a3b8'}
          />
        </View>
      </Card>
      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Allow media</Text>
          <Switch
            value={s.allowMedia ?? true}
            onValueChange={(v) => updateGroupSettings(groupId, 'allowMedia', v)}
            trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
            thumbColor={s.allowMedia ? '#2563eb' : '#94a3b8'}
          />
        </View>
      </Card>
      <Card>
        <View style={styles.row}>
          <Text style={styles.label}>Allow polls</Text>
          <Switch
            value={s.allowPolls ?? true}
            onValueChange={(v) => updateGroupSettings(groupId, 'allowPolls', v)}
            trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
            thumbColor={s.allowPolls ? '#2563eb' : '#94a3b8'}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, color: '#1e293b', flex: 1 },
});
