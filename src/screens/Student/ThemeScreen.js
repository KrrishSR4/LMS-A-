import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useApp } from '../../context/AppContext';
import { THEMES } from '../../mockData';
import { Ionicons } from '@expo/vector-icons';

export const ThemeScreen = () => {
    const { theme, setTheme } = useApp();

    const ThemeOption = ({ themeObj }) => {
        const isSelected = theme.id === themeObj.id;
        return (
            <Pressable
                style={[
                    styles.themeCard,
                    isSelected && { borderColor: themeObj.primary, borderWidth: 2 }
                ]}
                onPress={() => setTheme(themeObj)}
            >
                <View style={[styles.colorPreview, { backgroundColor: themeObj.primary }]}>
                    {isSelected && <Ionicons name="checkmark-circle" size={30} color="#fff" />}
                </View>
                <View style={styles.themeInfo}>
                    <Text style={[styles.themeName, isSelected && { color: themeObj.primary }]}>
                        {themeObj.name}
                    </Text>
                    <View style={styles.palette}>
                        <View style={[styles.swatch, { backgroundColor: themeObj.primary }]} />
                        <View style={[styles.swatch, { backgroundColor: themeObj.secondary }]} />
                        <View style={[styles.swatch, { backgroundColor: '#f8fafc' }]} />
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Choose Your Style</Text>
            <Text style={styles.subtitle}>Personalize your experience with a custom color palette.</Text>

            <View style={styles.themesList}>
                {Object.values(THEMES).map((t) => (
                    <ThemeOption key={t.id} themeObj={t} />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
    subtitle: { fontSize: 14, color: '#64748b', marginTop: 5, marginBottom: 25 },
    themesList: { gap: 15 },
    themeCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorPreview: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeInfo: { flex: 1, marginLeft: 15 },
    themeName: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
    palette: { flexDirection: 'row', marginTop: 8, gap: 6 },
    swatch: { width: 25, height: 8, borderRadius: 4 },
});
