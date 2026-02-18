import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Button } from '../../components';
import { useApp } from '../../context/AppContext';

/**
 * Admin - Student control: disable student, remove from group.
 */
export const AdminGroupMembersScreen = ({ route, navigation }) => {
  const { groupId, groupName } = route.params || {};
  const { groupMembers, students, disabledStudents, disableStudent, removeStudentFromGroup } =
    useApp();
  const members = groupMembers[groupId] || [];

  const handleDisable = (studentId) => {
    disableStudent(studentId);
  };

  const handleRemove = (studentId) => {
    Alert.alert('Remove Student', 'Remove this student from the group?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeStudentFromGroup(studentId, groupId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {members.map((id) => {
        const s = students[id] || { id, name: 'Unknown', phone: '' };
        const isDisabled = disabledStudents.includes(id);
        return (
          <Card key={id}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.phone}>{s.phone}</Text>
                {isDisabled && (
                  <Text style={styles.disabledBadge}>Disabled</Text>
                )}
              </View>
              <View style={styles.actions}>
                <Button
                  title={isDisabled ? 'Enable' : 'Disable'}
                  variant="secondary"
                  onPress={() => handleDisable(id)}
                  style={[styles.btn, isDisabled && { borderColor: '#22c55e' }]}
                />
                <Button
                  title="Remove"
                  variant="secondary"
                  onPress={() => handleRemove(id)}
                  style={[styles.btn, { borderColor: '#dc2626', marginTop: 8 }]}
                />
              </View>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  phone: { fontSize: 14, color: '#64748b', marginTop: 2 },
  disabledBadge: { fontSize: 12, color: '#dc2626', marginTop: 4 },
  actions: { marginLeft: 12 },
  btn: { paddingHorizontal: 16 },
});
