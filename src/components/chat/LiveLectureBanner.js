import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

/**
 * Live lecture banner - shown when a lecture is active.
 */
export const LiveLectureBanner = ({ lecture }) => {
  if (!lecture?.active) return null;

  return (
    <Pressable style={styles.banner}>
      <View style={styles.liveBadge}>
        <View style={styles.dot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
      <Text style={styles.title}>{lecture.title}</Text>
      <Text style={styles.instructor}>{lecture.instructor}</Text>
      <Text style={styles.join}>Tap to join →</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#dc2626',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  instructor: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  join: { color: '#fff', fontSize: 12, marginTop: 6, fontWeight: '500' },
});
