import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Modal, Alert } from 'react-native';
import { Card, Button } from '../../components';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Admin Fees Management - collect fees, send reminders, view bank details.
 */
export const AdminFeesScreen = () => {
    const { students, fees, bankAccount, collectFee, sendFeeReminder, updateBankDetails } = useApp();
    const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'paid'
    const [search, setSearch] = useState('');
    const [showBankModal, setShowBankModal] = useState(false);

    // Stats
    const studentList = Object.values(students).filter(s => s.id !== 'current_user');
    const totalStudents = studentList.length;
    const paidCount = studentList.filter(s => fees[s.id]?.status === 'paid').length;
    const pendingCount = totalStudents - paidCount;
    const totalCollected = bankAccount.balance;

    const filteredStudents = studentList.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const status = fees[s.id]?.status || 'pending';
        const matchesFilter = filter === 'all' || status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleCollect = (s) => {
        Alert.alert('Collect Fee', `Mark ${s.name}'s fee as paid?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Confirm', onPress: () => collectFee(s.id) }
        ]);
    };

    const handleRemind = (s) => {
        sendFeeReminder(s.id);
        Alert.alert('Reminder Sent', `A fee reminder has been sent to ${s.name}.`);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Fees Management</Text>
                    <Pressable style={styles.bankBtn} onPress={() => setShowBankModal(true)}>
                        <Ionicons name="card" size={20} color="#2563eb" />
                        <Text style={styles.bankBtnText}>Bank Account</Text>
                    </Pressable>
                </View>

                <View style={styles.statsRow}>
                    <Card style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                        <Text style={styles.statLabel}>Collected</Text>
                        <Text style={styles.statValue}>₹{totalCollected}</Text>
                    </Card>
                    <Card style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>{pendingCount} Std</Text>
                    </Card>
                </View>

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search student..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <View style={styles.filterRow}>
                    {['all', 'pending', 'paid'].map(f => (
                        <Pressable
                            key={f}
                            onPress={() => setFilter(f)}
                            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                        >
                            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {filteredStudents.map(s => {
                    const fee = fees[s.id] || { amount: 5000, status: 'pending', dueDate: 'N/A' };
                    const isPaid = fee.status === 'paid';

                    return (
                        <Card key={s.id} style={styles.studentCard}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.studentName}>{s.name}</Text>
                                    <Text style={styles.studentPhone}>{s.phone}</Text>
                                </View>
                                <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusPending]}>
                                    <Text style={[styles.statusText, isPaid ? styles.textPaid : styles.textPending]}>
                                        {isPaid ? 'PAID' : 'PENDING'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.feeInfo}>
                                <Text style={styles.amountText}>Amount: ₹{fee.amount}</Text>
                                <Text style={styles.dueText}>Due: {fee.dueDate}</Text>
                            </View>

                            {!isPaid && (
                                <View style={styles.cardActions}>
                                    <Button
                                        title="Remind"
                                        variant="secondary"
                                        onPress={() => handleRemind(s)}
                                        style={styles.actionBtn}
                                    />
                                    <Button
                                        title="Collect"
                                        onPress={() => handleCollect(s)}
                                        style={styles.actionBtn}
                                    />
                                </View>
                            )}
                        </Card>
                    );
                })}
            </ScrollView>

            {/* Bank Details Modal */}
            <Modal visible={showBankModal} transparent animationType="slide">
                <Pressable style={styles.modalOverlay} onPress={() => setShowBankModal(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bank Account (Prototype)</Text>
                        <View style={styles.bankCard}>
                            <Text style={styles.bankName}>{bankAccount.bankName}</Text>
                            <Text style={styles.bankNumber}>{bankAccount.accountNumber}</Text>
                            <Text style={styles.bankHolder}>{bankAccount.accountName}</Text>
                            <View style={styles.balanceContainer}>
                                <Text style={styles.balanceLabel}>Withdrawable Balance</Text>
                                <Text style={styles.balanceValue}>₹{bankAccount.balance}</Text>
                            </View>
                        </View>
                        <Button title="Withdraw to Bank" onPress={() => Alert.alert('Processing', 'Your request has been sent to the bank.')} style={{ marginTop: 20 }} />
                        <Button title="Close" variant="secondary" onPress={() => setShowBankModal(false)} style={{ marginTop: 12 }} />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
    bankBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 8, paddingHorizontal: 12, borderRadius: 12, gap: 6, elevation: 2 },
    bankBtnText: { color: '#2563eb', fontWeight: '700', fontSize: 13 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statCard: { flex: 1, borderLeftWidth: 5, padding: 16 },
    statLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
    statValue: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginTop: 4 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 50, marginBottom: 16, elevation: 1 },
    input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1e293b' },
    filterRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    filterBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e2e8f0' },
    filterBtnActive: { backgroundColor: '#2563eb' },
    filterText: { fontSize: 14, fontWeight: '600', color: '#475569' },
    filterTextActive: { color: '#fff' },
    studentCard: { padding: 16, marginBottom: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    studentName: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
    studentPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusPaid: { backgroundColor: '#dcfce7' },
    statusPending: { backgroundColor: '#fee2e2' },
    statusText: { fontSize: 10, fontWeight: '800' },
    textPaid: { color: '#15803d' },
    textPending: { color: '#b91c1c' },
    feeInfo: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
    amountText: { fontSize: 15, fontWeight: '600', color: '#334155' },
    dueText: { fontSize: 14, color: '#64748b' },
    cardActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
    actionBtn: { flex: 1, height: 44 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%' },
    modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
    bankCard: { backgroundColor: '#1e293b', padding: 24, borderRadius: 20 },
    bankName: { color: '#fff', fontSize: 18, fontWeight: '800' },
    bankNumber: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 4, letterSpacing: 2 },
    bankHolder: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12, textTransform: 'uppercase' },
    balanceContainer: { marginTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
    balanceLabel: { color: '#94a3b8', fontSize: 12 },
    balanceValue: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 4 },
});
