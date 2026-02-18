import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { Card, Button } from '../../components';
import { useApp } from '../../context/AppContext';

/**
 * Admin - approve pending students and assign to groups.
 */
export const AdminStudentApprovalScreen = ({ navigation }) => {
  const { pendingStudents, students, groups, assignStudentToGroup } = useApp();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async (studentId, groupId) => {
    setLoading(true);
    assignStudentToGroup(studentId, groupId);
    setLoading(false);
    setSelected(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Student Enrollment</Text>
      <Text style={styles.subtitle}>Manage student assignments and approvals.</Text>

      {pendingStudents.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Pending Approvals</Text>
          {pendingStudents.map((s) => (
            <Card key={s.id} style={styles.studentCard}>
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.name}>{s.name}</Text>
                  <Text style={styles.phone}>{s.phone}</Text>
                </View>
                <Button
                  title="Assign"
                  onPress={() => setSelected(s)}
                  style={styles.assignBtn}
                />
              </View>
            </Card>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Enrolled Students</Text>
      {Object.values(students).filter(s => s.id !== 'current_user').length === 0 ? (
        <Card>
          <Text style={styles.empty}>No students enrolled yet</Text>
        </Card>
      ) : (
        Object.values(students).filter(s => s.id !== 'current_user').map((s) => (
          <Card key={s.id} style={styles.studentCardActive}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.phone}>{s.phone}</Text>
              </View>
              <Button
                title="Move"
                variant="secondary"
                onPress={() => setSelected(s)}
                style={styles.assignBtn}
              />
            </View>
          </Card>
        ))
      )}

      <Modal visible={!!selected} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Assign to Group</Text>
            {selected && (
              <Text style={styles.modalSubtitle}>{selected.name}</Text>
            )}
            {groups?.map((g) => (
              <Button
                key={g.id}
                title={g.name}
                onPress={() => handleAssign(selected?.id, g.id)}
                loading={loading}
                style={styles.groupBtn}
              />
            ))}
            <Button title="Cancel" variant="secondary" onPress={() => setSelected(null)} />
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  phone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  studentCard: { marginBottom: 10, borderColor: '#e2e8f0', borderWidth: 1 },
  studentCardActive: { marginBottom: 10, backgroundColor: '#f0f9ff', borderColor: '#bae6fd', borderWidth: 1 },
  assignBtn: { marginLeft: 12, paddingHorizontal: 16 },
  empty: { color: '#64748b', textAlign: 'center', padding: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  groupBtn: { marginBottom: 12 },
});
