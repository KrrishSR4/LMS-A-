import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking } from 'react-native';

/**
 * Chat message bubble - admin vs student styling.
 */
export const MessageBubble = ({ message, isAdmin }) => {
  const isOwn = message.senderId === 'admin' || message.senderId === 'current_user';

  if (message.type === 'announcement') {
    return (
      <View style={styles.announcement}>
        <Text style={styles.pinBadge}>📌 Pinned</Text>
        <Text style={styles.announcementText}>{message.text}</Text>
        <Text style={styles.announcementSender}>— {message.senderName}</Text>
        <Text style={styles.announcementTime}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  if (message.type === 'poll') {
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.sender}>{message.senderName}</Text>
        <Text style={styles.pollQuestion}>{message.question}</Text>
        <View style={styles.pollOptions}>
          {(message.options || []).map((o) => (
            <View key={o.id} style={styles.pollOption}>
              <Text style={styles.pollOptionText}>{o.text}</Text>
              <Text style={styles.pollVotes}>{o.votes?.length || 0} votes</Text>
            </View>
          ))}
        </View>
        <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  if (message.type === 'image') {
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther, { padding: 4 }]}>
        <View style={styles.mediaHeader}>
          <Text style={[styles.sender, isOwn && styles.senderOwn]}>{message.senderName}</Text>
        </View>
        <Image
          source={{ uri: message.url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.mediaFooter}>
          <Text style={[styles.time, isOwn && styles.senderOwn]}>{formatTime(message.timestamp)}</Text>
        </View>
      </View>
    );
  }

  if (message.type === 'video') {
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther, { padding: 4 }]}>
        <View style={styles.mediaHeader}>
          <Text style={[styles.sender, isOwn && styles.senderOwn]}>{message.senderName}</Text>
        </View>
        <Pressable
          style={styles.videoPlaceholder}
          onPress={() => Linking.openURL(message.url)}
        >
          <View style={styles.playButton}>
            <Text style={{ fontSize: 32 }}>▶️</Text>
          </View>
          <Text style={styles.videoLabel}>Play Video</Text>
        </Pressable>
        <View style={styles.mediaFooter}>
          <Text style={[styles.time, isOwn && styles.senderOwn]}>{formatTime(message.timestamp)}</Text>
        </View>
      </View>
    );
  }

  if (message.type === 'pdf') {
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.sender}>{message.senderName}</Text>
        <View style={styles.pdfPreview}>
          <Text style={styles.pdfPlaceholder}>📄 PDF Document</Text>
        </View>
        {message.text ? <Text style={styles.text}>{message.text}</Text> : null}
        <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  if (message.type === 'voice') {
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.sender}>{message.senderName}</Text>
        <View style={styles.voiceBar}>
          <Text>▶️</Text>
          <View style={styles.voiceProgress} />
          <Text style={styles.voiceDuration}>0:15</Text>
        </View>
        <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  if (message.type === 'lecture') {
    return (
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.sender}>{message.senderName}</Text>
        <View style={styles.lectureLink}>
          <Text style={styles.lectureIcon}>🎥</Text>
          <Text style={styles.lectureText}>Recorded Lecture Link</Text>
        </View>
        <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  // Default: text
  return (
    <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
      <Text style={[styles.sender, isOwn && styles.senderOwn]}>{message.senderName}</Text>
      <Text style={[styles.text, isOwn && styles.textOwn]}>{message.text}</Text>
      <Text style={[styles.time, isOwn && styles.senderOwn]}>{formatTime(message.timestamp)}</Text>
    </View>
  );
};

const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 4,
  },
  textOwn: { color: '#0f172a', lineHeight: 21 },
  senderOwn: { color: '#075e54', fontSize: 11, fontWeight: '700' },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
  },
  sender: { fontSize: 13, fontWeight: '700', color: '#075e54', marginBottom: 2 },
  text: { fontSize: 16, color: '#0f172a', lineHeight: 22 },
  time: { fontSize: 11, color: '#64748b', marginTop: 4, alignSelf: 'flex-end' },
  announcement: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    borderLeftWidth: 6,
    borderLeftColor: '#f59e0b',
  },
  pinBadge: { fontSize: 11, fontWeight: '800', color: '#b45309', marginBottom: 6, textTransform: 'uppercase' },
  announcementText: { fontSize: 15, color: '#451a03', fontWeight: '500', lineHeight: 22 },
  announcementSender: { fontSize: 12, color: '#78350f', marginTop: 6, opacity: 0.8 },
  announcementTime: { fontSize: 10, color: '#92400e', marginTop: 2 },
  // ... other styles updated for modern look ...
  pollQuestion: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  pollOptions: { gap: 8 },
  pollOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pollOptionText: { fontSize: 14, color: '#334155', fontWeight: '500' },
  pollVotes: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: '#fff',
    marginTop: 10,
    fontWeight: '700',
    fontSize: 14,
  },
  mediaHeader: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
  },
  mediaFooter: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  imagePlaceholder: { fontSize: 14, color: '#94a3b8', fontWeight: '600' },
  pdfPreview: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  pdfPlaceholder: { fontSize: 14, color: '#475569', fontWeight: '600' },
  voiceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  voiceProgress: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  voiceDuration: { fontSize: 11, color: '#fff' },
  lectureLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  lectureIcon: { fontSize: 24 },
  lectureText: { fontSize: 14, color: '#1e40af', fontWeight: '700' },
});
