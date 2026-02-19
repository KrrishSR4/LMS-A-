import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Animated, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';

/**
 * Modern Chat input - WhatsApp style.
 * Send button appears when typing, otherwise shows attachment/voice icons.
 */
export const ChatInputControlled = ({
  value,
  onChangeText,
  onSend,
  onPlusPress,
  placeholder = 'Message',
  disabled,
}) => {
  const { uploadFile } = useApp();
  const [isTyping, setIsTyping] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [isUploading, setIsUploading] = useState(false);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow access to gallery to send images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      handleUpload(asset.uri, asset.fileName || 'upload.jpg', asset.type);
    }
  };

  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow access to camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      handleUpload(asset.uri, asset.fileName || 'camera.jpg', 'image');
    }
  };

  const handleUpload = async (uri, name, type) => {
    setIsUploading(true);
    const publicUrl = await uploadFile(uri, name);
    setIsUploading(false);

    if (publicUrl) {
      onSend(publicUrl, type === 'video' ? 'video' : 'image');
    } else {
      Alert.alert('Upload Error', 'Failed to upload media to storage.');
    }
  };

  return (
    <View style={[styles.outerContainer, { paddingBottom: Math.max(insets.bottom, 15) }]}>
      <Pressable style={styles.plusBtn} onPress={onPlusPress} disabled={disabled || isUploading}>
        <Ionicons name="add" size={24} color="#64748b" />
      </Pressable>

      <View style={styles.inputCard}>
        <Pressable style={styles.iconBtn} disabled={disabled || isUploading}>
          <Ionicons name="happy-outline" size={24} color="#64748b" />
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder={isUploading ? 'Uploading...' : placeholder}
          placeholderTextColor="#94a3b8"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={2000}
          editable={!disabled && !isUploading}
          blurOnSubmit={false}
        />
        <Pressable style={styles.iconBtn} onPress={pickImage} disabled={disabled || isUploading}>
          <Ionicons name="attach-outline" size={24} color="#64748b" style={{ transform: [{ rotate: '45deg' }] }} />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={pickCamera} disabled={disabled || isUploading}>
          <Ionicons name="camera-outline" size={24} color="#64748b" />
        </Pressable>
      </View>

      <Animated.View style={[styles.sendCircle, { transform: [{ scale: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}>
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inputCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 10,
    maxHeight: 120,
    fontWeight: '400',
  },
  iconBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendCircle: {
    marginLeft: 8,
  },
  mainBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtn: {
    backgroundColor: '#2563eb',
  },
});
