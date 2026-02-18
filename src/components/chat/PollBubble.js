import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

/**
 * Poll message with interactive voting.
 */
export const PollBubble = ({ message, onVote, voterId, isAdmin }) => {
  const hasVoted = (message.options || []).some((o) => o.votes?.includes(voterId));

  const handleVote = (optionId) => {
    if (isAdmin || hasVoted) return;
    onVote(message.id, optionId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sender}>{message.senderName}</Text>
      <Text style={styles.question}>{message.question}</Text>
      <View style={styles.options}>
        {(message.options || []).map((o) => {
          const voted = o.votes?.includes(voterId);
          const total = (message.options || []).reduce((s, opt) => s + (opt.votes?.length || 0), 0);
          const pct = total > 0 ? ((o.votes?.length || 0) / total) * 100 : 0;
          return (
            <Pressable
              key={o.id}
              style={[styles.option, voted && styles.optionVoted]}
              onPress={() => handleVote(o.id)}
              disabled={isAdmin || hasVoted}
            >
              <View style={[styles.bar, { width: `${pct}%` }]} />
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{o.text}</Text>
                <Text style={styles.voteCount}>{o.votes?.length || 0} votes</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
    </View>
  );
};

const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '85%',
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    marginVertical: 4,
  },
  sender: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  question: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  options: { gap: 8 },
  option: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  optionVoted: { borderWidth: 1, borderColor: '#2563eb' },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  optionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionText: { fontSize: 14, color: '#1e293b' },
  voteCount: { fontSize: 12, color: '#64748b' },
  time: { fontSize: 11, color: '#94a3b8', marginTop: 8 },
});
