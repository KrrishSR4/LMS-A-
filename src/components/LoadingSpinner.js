import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Loading indicator for async actions.
 */
export const LoadingSpinner = ({ size = 'large', color = '#2563eb' }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
