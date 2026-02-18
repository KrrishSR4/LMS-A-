import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, Animated } from 'react-native';
import { Card, Button } from '../../components';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Student Fees Screen - view status and pay fees.
 */
export const StudentFeesScreen = () => {
    const { profile, fees, payFee } = useApp();
    const [paying, setPaying] = useState(false);

    const studentId = profile?.id || 'current_user';
    const feeInfo = fees[studentId] || { amount: 5000, status: 'pending', dueDate: '2026-03-05' };
    const isPaid = feeInfo.status === 'paid';

    const handlePay = () => {
        Alert.alert('Simulate Payment', `Pay ₹${feeInfo.amount} for current month?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Pay Now',
                onPress: () => {
                    setPaying(true);
                    // Simulate 1.5s gateway delay
                    setTimeout(() => {
                        payFee(studentId, feeInfo.amount);
                        setPaying(false);
                        Alert.alert('Success', 'Fees Paid Successfully! Your receipt is being generated.');
                    }, 1500);
                }
            }
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card style={styles.statusCard}>
                <View style={[styles.statusIconBg, { backgroundColor: isPaid ? '#dcfce7' : '#fee2e2' }]}>
                    <Ionicons name={isPaid ? 'checkmark-circle' : 'alert-circle'} size={40} color={isPaid ? '#15803d' : '#ef4444'} />
                </View>
                <Text style={styles.statusTitle}>{isPaid ? 'All Fees Paid' : 'Fee Payment Pending'}</Text>
                <Text style={styles.statusSub}>Month: February 2026</Text>
            </Card>

            <Text style={styles.sectionTitle}>Payment Details</Text>
            <Card style={styles.detailsCard}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monthly Fees</Text>
                    <Text style={styles.detailValue}>₹{feeInfo.amount}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Exam Fees</Text>
                    <Text style={styles.detailValue}>Included</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Due Date</Text>
                    <Text style={styles.detailValue}>{feeInfo.dueDate}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <Text style={styles.totalValue}>₹{feeInfo.amount}</Text>
                </View>
            </Card>

            {!isPaid ? (
                <Button
                    title={paying ? "Processing..." : "Pay Now"}
                    onPress={handlePay}
                    loading={paying}
                    style={styles.payBtn}
                />
            ) : (
                <Card style={styles.receiptCard}>
                    <Ionicons name="receipt-outline" size={24} color="#64748b" />
                    <View style={styles.receiptInfo}>
                        <Text style={styles.receiptTitle}>Transaction Successful</Text>
                        <Text style={styles.receiptMeta}>ID: TXN_DEMO_{Math.floor(Math.random() * 10000)}</Text>
                    </View>
                    <Pressable onPress={() => Alert.alert('Recipe Downloaded', 'The fee receipt has been saved to your downloads.')}>
                        <Ionicons name="download-outline" size={24} color="#2563eb" />
                    </Pressable>
                </Card>
            )}

            <View style={styles.footer}>
                <Ionicons name="shield-checkmark" size={16} color="#94a3b8" />
                <Text style={styles.footerText}>Secure 256-bit encrypted payments</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 24, paddingBottom: 40 },
    statusCard: { alignItems: 'center', paddingVertical: 32, marginBottom: 24, borderRadius: 32 },
    statusIconBg: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    statusTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
    statusSub: { fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '500' },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    detailsCard: { padding: 20, marginBottom: 32, borderRadius: 24 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    detailLabel: { fontSize: 15, color: '#64748b', fontWeight: '500' },
    detailValue: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 16 },
    totalLabel: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
    totalValue: { fontSize: 20, fontWeight: '900', color: '#2563eb' },
    payBtn: { height: 60, borderRadius: 20 },
    receiptCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#eff6ff', borderColor: '#dbeafe', borderWidth: 1 },
    receiptInfo: { flex: 1, marginLeft: 16 },
    receiptTitle: { fontSize: 15, fontWeight: '700', color: '#1e40af' },
    receiptMeta: { fontSize: 12, color: '#60a5fa', marginTop: 2 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 8 },
    footerText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
});
