import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatInputControlled } from '../../components/chat/ChatInput';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { PollBubble } from '../../components/chat/PollBubble';
import { DateSeparator } from '../../components/chat/DateSeparator';
import { LiveLectureBanner } from '../../components/chat/LiveLectureBanner';
import { useApp } from '../../context/AppContext';
import { isNewDay, generateId } from '../../utils/helpers';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

/**
 * Admin Group Chat - fully interactive.
 * Send text, announcement, poll, image, pdf, voice, lecture link.
 * Student control: disable, remove.
 */
export const AdminGroupChatScreen = ({ route, navigation }) => {
  const { groupId, groupName } = route.params || {};
  const {
    messages,
    addMessage,
    deleteMessage,
    votePoll,
    settings,
    groupMembers,
    students,
    profile,
    liveLecture,
    disableStudent,
    removeStudentFromGroup,
    isTyping,
    simulateTyping,
    uploadFile,
    groupLives,
    startLive,
    endLive,
  } = useApp();
  const [input, setInput] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [liveLink, setLiveLink] = useState('');
  const [liveTitle, setLiveTitle] = useState('');
  const flatListRef = useRef(null);

  const groupTyping = isTyping[groupId] || [];

  const msgList = (messages[groupId] || []).slice().sort((a, b) => a.timestamp - b.timestamp);
  const groupSettings = settings[groupId] || {};
  const members = groupMembers[groupId] || [];
  const currentLive = groupLives[groupId];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <Pressable onPress={() => navigation.navigate('GroupMembers', { groupId, groupName })}>
            <Text style={styles.headerBtn}>Members</Text>
          </Pressable>
          <Pressable
            style={styles.headerBtnSpacer}
            onPress={() => navigation.navigate('GroupSettings', { groupId, groupName })}
          >
            <Text style={styles.headerBtn}>Settings</Text>
          </Pressable>
        </View>
      ),
    });
  }, [groupId, groupName]);

  useEffect(() => {
    if (msgList.length > 0 && flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [msgList.length]);

  const sendText = (text, type = 'text') => {
    if (!text?.trim()) return;
    addMessage(groupId, {
      type,
      senderId: 'admin',
      senderName: 'Admin',
      [type === 'text' ? 'text' : 'url']: text.trim(),
    });
  };

  const sendAnnouncement = (text) => {
    if (!text?.trim()) return;
    addMessage(groupId, {
      type: 'announcement',
      senderId: 'admin',
      senderName: 'Admin',
      text: text.trim(),
      pinned: true,
    });
  };

  const sendPoll = () => {
    const opts = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || opts.length < 2) return;
    addMessage(groupId, {
      type: 'poll',
      senderId: 'admin',
      senderName: 'Admin',
      question: pollQuestion.trim(),
      options: opts.map((text, i) => ({ id: `o${i}`, text, votes: [] })),
    });
    setShowPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const sendAttachment = async (type) => {
    setShowActions(false);
    if (type === 'image') {
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'pdf' ? 'application/pdf' : 'video/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const publicUrl = await uploadFile(asset.uri, asset.name);

        if (publicUrl) {
          addMessage(groupId, {
            type,
            senderId: 'admin',
            senderName: 'Admin',
            url: publicUrl,
            text: asset.name,
          });
        }
      }
    } catch (error) {
      console.error('Document Pick error:', error);
      Alert.alert('Error', 'Failed to pick or upload document.');
    }
  };

  const sendVoice = () => {
    Alert.alert('Coming Soon', 'Voice Note feature is currently under development.');
    setShowActions(false);
  };

  const sendLecture = () => {
    // Recorded Lecture is now handled by sendAttachment('lecture') usually, 
    // but the modal calls sendLecture directly. Let's point it to attachment picker.
    sendAttachment('lecture');
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMessage(groupId, messageId),
        },
      ]
    );
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
            onVote={() => { }}
            voterId="admin"
            isAdmin
            onLongPress={() => handleDeleteMessage(item.id)}
          />
        ) : (
          <MessageBubble
            message={item}
            isAdmin
            onLongPress={() => handleDeleteMessage(item.id)}
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {currentLive?.active && (
        <LiveLectureBanner
          lecture={currentLive}
          isAdmin={true}
          onEndLive={() => endLive(groupId)}
        />
      )}
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
          onChangeText={(t) => {
            setInput(t);
          }}
          onSend={sendText}
          onPlusPress={() => setShowActions(!showActions)}
          placeholder="Write a message..."
        />
      </View>

      {/* Admin actions modal */}
      <Modal visible={showActions} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Send as Admin</Text>
            <Pressable style={styles.actionItem} onPress={() => { setShowActions(false); setShowAnnouncement(true); }}>
              <Text>📌 Announcement</Text>
            </Pressable>
            <Pressable style={styles.actionItem} onPress={() => { setShowActions(false); setShowPoll(true); }}>
              <Text>📊 Poll</Text>
            </Pressable>
            <Pressable style={styles.actionItem} onPress={() => sendAttachment('image')}>
              <Text>🖼️ Image</Text>
            </Pressable>
            <Pressable style={styles.actionItem} onPress={() => sendAttachment('pdf')}>
              <Text>📄 PDF</Text>
            </Pressable>
            <Pressable style={styles.actionItem} onPress={sendVoice}>
              <Text>🎤 Voice Note</Text>
            </Pressable>
            <Pressable style={styles.actionItem} onPress={sendLecture}>
              <Text>🎥 Recorded Lecture</Text>
            </Pressable>
            <Pressable
              style={[styles.actionItem, currentLive?.active && { backgroundColor: '#fef2f2' }]}
              onPress={() => {
                setShowActions(false);
                if (currentLive?.active) {
                  Alert.alert(
                    'End Live',
                    'Are you sure you want to end the live lecture?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'End Live', style: 'destructive', onPress: () => endLive(groupId) },
                    ]
                  );
                } else {
                  setShowLiveModal(true);
                }
              }}
            >
              <Text>{currentLive?.active ? '⏹️ End Live Lecture' : '🔴 Start Live Lecture'}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Announcement modal */}
      <Modal visible={showAnnouncement} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAnnouncement(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Send Announcement</Text>
            <TextInput
              style={styles.input}
              placeholder="Announcement text..."
              value={announcementText}
              onChangeText={setAnnouncementText}
              multiline
            />
            <Pressable
              style={styles.sendPollBtn}
              onPress={() => {
                sendAnnouncement(announcementText);
                setAnnouncementText('');
                setShowAnnouncement(false);
              }}
            >
              <Text style={styles.sendPollText}>Send</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Poll creation modal */}
      <Modal visible={showPoll} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowPoll(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Create Poll</Text>
            <TextInput
              style={styles.input}
              placeholder="Question"
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />
            {pollOptions.map((opt, i) => (
              <TextInput
                key={i}
                style={styles.input}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChangeText={(t) => {
                  const next = [...pollOptions];
                  next[i] = t;
                  setPollOptions(next);
                }}
              />
            ))}
            <Pressable onPress={() => setPollOptions([...pollOptions, ''])}>
              <Text style={styles.addOpt}>+ Add option</Text>
            </Pressable>
            <Pressable style={styles.sendPollBtn} onPress={sendPoll}>
              <Text style={styles.sendPollText}>Send Poll</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Start Live Lecture modal */}
      <Modal visible={showLiveModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowLiveModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>🔴 Start Live Lecture</Text>
            <TextInput
              style={styles.input}
              placeholder="Lecture Title (e.g. Physics Ch-3)"
              value={liveTitle}
              onChangeText={setLiveTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Paste YouTube Live Link here..."
              value={liveLink}
              onChangeText={setLiveLink}
              autoCapitalize="none"
              keyboardType="url"
            />
            <Pressable
              style={[styles.sendPollBtn, { backgroundColor: '#dc2626' }]}
              onPress={() => {
                if (!liveLink.trim()) {
                  Alert.alert('Error', 'Please paste a YouTube link');
                  return;
                }
                startLive(groupId, liveLink.trim(), liveTitle.trim());
                setLiveLink('');
                setLiveTitle('');
                setShowLiveModal(false);
                Alert.alert('Live Started! 🔴', 'All students in this group can now join the live lecture.');
              }}
            >
              <Text style={styles.sendPollText}>Go Live 🔴</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  listContent: { padding: 16, paddingBottom: 10 },
  headerRight: { flexDirection: 'row', gap: 12, marginRight: 8 },
  headerBtn: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerBtnSpacer: {},
  inputRow: {
    backgroundColor: '#fff',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    width: '100%',
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, color: '#0f172a', textAlign: 'center' },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  addOpt: { color: '#2563eb', marginBottom: 16, fontWeight: '600', paddingLeft: 4 },
  sendPollBtn: { backgroundColor: '#2563eb', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  sendPollText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
