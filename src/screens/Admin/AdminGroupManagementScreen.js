import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Modal, Pressable, Alert } from 'react-native';
import { Card, Button } from '../../components';
import { useApp } from '../../context/AppContext';

/**
 * Admin - create, rename, delete groups.
 */
export const AdminGroupManagementScreen = ({ navigation }) => {
  const { groups, addGroup, renameGroup, deleteGroup } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    setLoading(true);
    addGroup(newName.trim());
    setLoading(false);
    setNewName('');
    setShowCreate(false);
  };

  const handleRename = () => {
    if (!editName.trim() || !editing) return;
    setLoading(true);
    renameGroup(editing.id, editName.trim());
    setLoading(false);
    setEditing(null);
    setEditName('');
  };

  const handleDelete = (g) => {
    Alert.alert('Delete Group', `Delete "${g.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteGroup(g.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Button title="+ Create Group" onPress={() => setShowCreate(true)} style={styles.createBtn} />

      {groups?.map((g) => (
        <Card key={g.id}>
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.name}>{g.name}</Text>
              <Text style={styles.meta}>ID: {g.id}</Text>
            </View>
            <View style={styles.actions}>
              <Button
                title="Rename"
                variant="secondary"
                onPress={() => {
                  setEditing(g);
                  setEditName(g.name);
                }}
                style={styles.actionBtn}
              />
              <Button
                title="Delete"
                variant="secondary"
                onPress={() => handleDelete(g)}
                style={[styles.actionBtn, { borderColor: '#dc2626' }]}
              />
            </View>
          </View>
        </Card>
      ))}

      <Modal visible={showCreate} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCreate(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Create Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group name (e.g. Class 11)"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
            />
            <View style={styles.modalBtns}>
              <Button title="Create" onPress={handleCreate} loading={loading} style={styles.modalBtn} />
              <Button title="Cancel" variant="secondary" onPress={() => setShowCreate(false)} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={!!editing} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setEditing(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Rename Group</Text>
            <TextInput
              style={styles.input}
              placeholder="New name"
              value={editName}
              onChangeText={setEditName}
              autoCapitalize="words"
            />
            <View style={styles.modalBtns}>
              <Button title="Save" onPress={handleRename} loading={loading} style={styles.modalBtn} />
              <Button title="Cancel" variant="secondary" onPress={() => setEditing(null)} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 32 },
  createBtn: { marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  meta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 16, marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  modalBtns: { gap: 12 },
  modalBtn: { marginBottom: 8 },
});
