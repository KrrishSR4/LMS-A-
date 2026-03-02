import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Live lecture banner - shown when a lecture is active in a group.
 * Tapping opens the YouTube link in the YouTube app or browser.
 * Props: lecture ({ active, link, title }), isAdmin, onEndLive
 */
export const LiveLectureBanner = ({ lecture, isAdmin, onEndLive }) => {
  if (!lecture?.active) return null;

  const handleJoin = () => {
    if (!lecture.link) {
      Alert.alert('Error', 'No link available for this live lecture.');
      return;
    }
    Linking.openURL(lecture.link).catch(() => {
      Alert.alert('Error', 'Could not open the link. Please try again.');
    });
  };

  const handleEndLive = () => {
    Alert.alert(
      'End Live Lecture',
      'Are you sure you want to end this live session for everyone?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Live', style: 'destructive', onPress: () => onEndLive?.() },
      ]
    );
  };

  return (
    <Pressable style={styles.banner} onPress={handleJoin}>
      <View style={styles.topRow}>
        <View style={styles.liveBadge}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        {isAdmin && (
          <Pressable
            style={styles.endBtn}
            onPress={(e) => {
              e.stopPropagation();
              handleEndLive();
            }}
          >
            <Ionicons name="stop-circle-outline" size={16} color="#fff" />
            <Text style={styles.endText}>End Live</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>{lecture.title || 'Live Lecture'}</Text>
      <View style={styles.joinRow}>
        <Ionicons name="videocam" size={16} color="#fff" />
        <Text style={styles.join}>Tap to Join Live Class →</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#dc2626',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  liveText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  endText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  joinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  join: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
});
