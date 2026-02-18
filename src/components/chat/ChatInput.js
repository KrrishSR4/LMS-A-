import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Modern Chat input - WhatsApp style.
 * Send button appears when typing, otherwise shows attachment/voice icons.
 */
export const ChatInputControlled = ({
  value,
  onChangeText,
  onSend,
  placeholder = 'Message',
  disabled,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const typing = value?.trim().length > 0;
    if (typing !== isTyping) {
      setIsTyping(typing);
      Animated.spring(scaleAnim, {
        toValue: typing ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value?.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      onChangeText('');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputCard}>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="happy-outline" size={24} color="#64748b" />
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={2000}
          editable={!disabled}
          blurOnSubmit={false}
        />
        <Pressable style={styles.iconBtn}>
          <Ionicons name="attach" size={26} color="#64748b" style={{ transform: [{ rotate: '45deg' }] }} />
        </Pressable>
        {!isTyping && (
          <Pressable style={styles.iconBtn}>
            <Ionicons name="camera-outline" size={24} color="#64748b" />
          </Pressable>
        )}
      </View>

      <Animated.View style={[styles.sendCircle, { transform: [{ scale: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
        <Pressable
          onPress={isTyping ? handleSend : null}
          style={[styles.mainBtn, !isTyping && styles.micBtn]}
        >
          <Ionicons
            name={isTyping ? "send" : "mic"}
            size={22}
            color="#fff"
            style={isTyping ? { marginLeft: 3 } : {}}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  inputCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 10,
    maxHeight: 120,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCircle: {
    marginLeft: 6,
  },
  mainBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  micBtn: {
    backgroundColor: '#2563eb', // Can be blue or another accent
  },
});
