import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatInputControlled } from '../../components/chat/ChatInput';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { PollBubble } from '../../components/chat/PollBubble';
import { DateSeparator } from '../../components/chat/DateSeparator';
import { LiveLectureBanner } from '../../components/chat/LiveLectureBanner';
import { useApp } from '../../context/AppContext';
import { isNewDay } from '../../utils/helpers';

import { Ionicons } from '@expo/vector-icons';

/**
 * Student Group Chat - send messages if allowed, vote in polls, view attachments.
 */
export const StudentGroupChatScreen = ({ route, navigation }) => {
  const { groupId, groupName } = route.params || {};
  const {
    messages,
    addMessage,
    votePoll,
    settings,
    profile,
    disabledStudents,
    liveLecture,
    isTyping,
  } = useApp();
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  const msgList = (messages[groupId] || []).slice().sort((a, b) => a.timestamp - b.timestamp);
  const groupSettings = settings[groupId] || {};
  const canSend = groupSettings.allowStudentMessages !== false;
  const isDisabled = disabledStudents.includes(profile?.id);
  const showLiveBanner = liveLecture?.active && liveLecture?.groupId === groupId;
  const voterId = profile?.id || 'current_user';
  const groupTyping = isTyping[groupId] || [];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.headerRight}
          onPress={() => navigation.navigate('GroupInfo', { groupId, groupName })}
        >
          <Text style={styles.infoBtn}>Info</Text>
        </Pressable>
      ),
    });
  }, [groupId, groupName]);

  useEffect(() => {
    if (msgList.length > 0 && flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [msgList.length]);

  const sendText = (text) => {
    if (!text?.trim() || !canSend || isDisabled) return;
    addMessage(groupId, {
      type: 'text',
      senderId: voterId,
      senderName: profile?.name || 'Student',
      text: text.trim(),
    });
  };

  const handleVote = (messageId, optionId) => {
    votePoll(groupId, messageId, optionId, voterId);
  };

  const renderItem = ({ item, index }) => {
    const prev = msgList[index - 1];
    const showDate = isNewDay(prev?.timestamp, item.timestamp);
    return (
      <View>
        {showDate && <DateSeparator timestamp={item.timestamp} />}
        {item.type === 'poll' ? (
          <PollBubble
            message={item}
            onVote={handleVote}
            voterId={voterId}
            isAdmin={false}
          />
        ) : (
          <MessageBubble
            message={{
              ...item,
              senderId: item.senderId === 'admin' ? 'admin' : 'current_user',
            }}
            isAdmin={false}
          />
        )}
      </View>
    );
  };

  const inputDisabled = !canSend || isDisabled;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 95 : 95}
    >
      {showLiveBanner && <LiveLectureBanner lecture={liveLecture} />}
      <FlatList
        ref={flatListRef}
        data={msgList}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={() =>
          groupTyping.length > 0 ? (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>{groupTyping.join(', ')} {groupTyping.length > 1 ? 'are' : 'is'} typing...</Text>
            </View>
          ) : null
        }
      />
      <View style={styles.inputRow}>
        <ChatInputControlled
          value={input}
          onChangeText={setInput}
          onSend={sendText}
          onPlusPress={() => navigation.navigate('GroupInfo', { groupId, groupName })}
          placeholder={inputDisabled ? (isDisabled ? 'You are disabled' : 'Messages disabled') : 'Write a message...'}
          disabled={inputDisabled}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  listContent: { padding: 16, paddingBottom: 10 },
  headerRight: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#eff6ff', borderRadius: 20, marginRight: 8 },
  infoBtn: { fontSize: 13, color: '#2563eb', fontWeight: '700' },
  inputRow: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
