import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Primary and secondary button component.
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    style={({ pressed }) => [
      styles.btn,
      variant === 'primary' ? styles.primary : styles.secondary,
      (pressed || disabled) && styles.pressed,
      style,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563eb'} />
    ) : (
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{title}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textSecondary: {
    color: '#2563eb',
  },
});
