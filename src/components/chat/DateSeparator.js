import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateSeparator } from '../../utils/helpers';

/**
 * Date separator in chat (Today, Yesterday, or full date).
 */
export const DateSeparator = ({ timestamp }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{formatDateSeparator(timestamp)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
