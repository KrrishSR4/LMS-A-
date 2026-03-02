import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { clearSession, getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';
import {
  DEFAULT_GROUPS,
  DEFAULT_PENDING_STUDENTS,
  DEFAULT_GROUP_MEMBERS,
  DEFAULT_STUDENTS,
  DEFAULT_PROFILE,
  getInitialMessages,
  getDefaultGroupSettings,
  LIVE_LECTURE_BANNER,
  THEMES,
} from '../mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId, checkAdmin } from '../utils/helpers';
// Switch to Firebase for authentication
import { auth, storage } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [role, setRole] = useState('student'); // 'admin' | 'student'
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState({});
  const [pendingStudents, setPendingStudents] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [students, setStudents] = useState({});
  const [settings, setSettings] = useState({});
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [disabledStudents, setDisabledStudents] = useState([]);
  const [liveLecture, setLiveLecture] = useState(LIVE_LECTURE_BANNER);
  const [isTyping, setIsTyping] = useState({}); // { groupId: [username, ...] }
  const [fees, setFees] = useState({}); // { studentId: { amount: number, status: 'pending'|'paid', dueDate: string } }
  const [bankAccount, setBankAccount] = useState({ balance: 0, accountName: '', accountNumber: '', bankName: '' });
  const [session, setSession] = useState(null);
  const [recentLogins, setRecentLogins] = useState([]); // Array of { name, time, role }
  const [theme, setTheme] = useState(THEMES.indigo);
  const [groupLives, setGroupLives] = useState({}); // { groupId: { active: true, link: 'youtube_url', title: 'Lecture Name' } }

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      if (user) {
        setProfile(prev => {
          const enrolledUser = students[user.uid] || {};
          // Check pending students list as well
          const pendingUser = (pendingStudents || []).find(s => s.id === user.uid) || {};

          return {
            ...prev,
            id: user.uid,
            name: enrolledUser.name || pendingUser.name || user.displayName || prev.name || 'Student',
            phone: user.phoneNumber || enrolledUser.phone || pendingUser.phone || prev.phone,
            email: user.email || enrolledUser.email || pendingUser.email || prev.email,
          };
        });
      } else {
        setProfile(DEFAULT_PROFILE);
        setRole('student');
      }
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      await clearSession();
      setRole('student');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const trackLogin = useCallback((userData) => {
    if (userData.role === 'student') {
      const studentId = userData.id || auth.currentUser?.uid || generateId();

      setRecentLogins(prev => [{
        id: generateId(),
        name: userData.name || userData.email || userData.phone || 'New Student',
        time: new Date().toLocaleTimeString(),
        role: 'student'
      }, ...prev].slice(0, 10));

      // Update name if not present in profile
      setProfile(prev => ({
        ...prev,
        name: userData.name || prev.name || 'Student',
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
      }));

      // Update enrolled storage if name is provided
      if (userData.name) {
        setStudents(prev => {
          if (prev[studentId]) {
            return {
              ...prev,
              [studentId]: { ...prev[studentId], name: userData.name }
            };
          }
          return prev;
        });
      }

      // Add to pending if new student and not yet assigned
      setPendingStudents(prev => {
        const isAlreadyPending = prev.find(s => s.id === studentId);
        const isAssigned = Object.values(groupMembers).some(m => m.includes(studentId));

        if (!isAssigned) {
          if (isAlreadyPending) {
            // Update name even if already pending
            return prev.map(s => s.id === studentId ? { ...s, name: userData.name || s.name } : s);
          }
          return [...prev, {
            id: studentId,
            name: userData.name || userData.email || userData.phone || 'New Student',
            phone: userData.phone || userData.email || 'Signup',
            requestedAt: Date.now(),
          }];
        }
        return prev;
      });
    }
  }, [groupMembers]);

  // Upload File Logic (Firebase Storage) - Robust Blob conversion
  const uploadFile = useCallback(async (fileUri, fileName) => {
    try {
      // Use XMLHttpRequest for robust blob conversion as fetch() can be unreliable on mobile
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => {
          console.error('Blob conversion error:', e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', fileUri, true);
        xhr.send(null);
      });

      const path = `attachments/${profile.id || 'anonymous'}/${Date.now()}_${fileName}`;
      const storageRef = ref(storage, path);

      const uploadTask = await uploadBytesResumable(storageRef, blob);
      const publicUrl = await getDownloadURL(uploadTask.ref);

      return publicUrl;
    } catch (error) {
      console.error('Firebase Upload failed:', error);
      return null;
    }
  }, [profile.id]);

  const deleteMessage = useCallback((groupId, messageId) => {
    setMessages((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter((m) => m.id !== messageId),
    }));
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedGroups = await getItem(STORAGE_KEYS.GROUPS);
      const storedMessages = await getItem(STORAGE_KEYS.MESSAGES);
      const storedPending = await getItem(STORAGE_KEYS.PENDING_STUDENTS);
      const storedMembers = await getItem(STORAGE_KEYS.GROUP_MEMBERS);
      const storedStudents = await getItem(STORAGE_KEYS.STUDENTS);
      const storedRole = await getItem(STORAGE_KEYS.ROLE);
      const storedSettings = await getItem(STORAGE_KEYS.SETTINGS);
      const storedLiveLecture = await getItem(STORAGE_KEYS.LIVE_LECTURE);
      const storedFees = await getItem('lms_fees');
      const storedBank = await getItem('lms_bank');
      const storedTheme = await getItem('lms_theme');

      setGroups(storedGroups || []);
      setPendingStudents(storedPending || []);
      setGroupMembers(storedMembers || {});
      setStudents(storedStudents || {});

      // Data migration v2 - clear mocked sessions
      const migrationV2Done = await AsyncStorage.getItem('migration_nuclear_v2');
      if (!migrationV2Done) {
        await signOut(auth);
        await clearSession();
        await AsyncStorage.clear(); // Complete wipe
        await AsyncStorage.setItem('migration_nuclear_v2', 'true');
        console.log('System migration complete. All sessions terminated.');
        // Re-init defaults after wipe
        setGroups([]);
        setPendingStudents([]);
        setGroupMembers({});
        setStudents({});
        setMessages({});
      }

      setMessages(storedMessages || {});

      if (storedSettings) {
        setSettings(storedSettings);
      } else {
        setSettings(
          Object.fromEntries(DEFAULT_GROUPS.map((g) => [g.id, getDefaultGroupSettings(g.id)[g.id]]))
        );
      }

      setRole(storedRole || 'student');
      setLiveLecture(storedLiveLecture || { ...LIVE_LECTURE_BANNER });

      if (storedFees) {
        setFees(storedFees);
      } else {
        const initialFees = {};
        Object.keys(DEFAULT_STUDENTS).forEach(id => {
          initialFees[id] = { amount: 5000, status: 'pending', dueDate: '2026-03-05' };
        });
        setFees(initialFees);
      }
      setBankAccount(storedBank || { balance: 0, accountName: 'Admin Primary', accountNumber: '**** 8899', bankName: 'HDFC Bank' });
      if (storedTheme) setTheme(storedTheme);

      setIsReady(true);
    };
    init();
  }, []);

  const simulateTyping = useCallback((groupId, username) => {
    setIsTyping(prev => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), username]
    }));

    setTimeout(() => {
      setIsTyping(prev => ({
        ...prev,
        [groupId]: (prev[groupId] || []).filter(u => u !== username)
      }));
    }, 3000);
  }, []);

  const persist = useCallback(async () => {
    await setItem(STORAGE_KEYS.GROUPS, groups);
    await setItem(STORAGE_KEYS.MESSAGES, messages);
    await setItem(STORAGE_KEYS.PENDING_STUDENTS, pendingStudents);
    await setItem(STORAGE_KEYS.GROUP_MEMBERS, groupMembers);
    await setItem(STORAGE_KEYS.SETTINGS, settings);
    await setItem(STORAGE_KEYS.PROFILE, profile);
    await setItem(STORAGE_KEYS.ROLE, role);
    await setItem(STORAGE_KEYS.DISABLED_STUDENTS, disabledStudents);
    await setItem(STORAGE_KEYS.STUDENTS, students);
    await setItem(STORAGE_KEYS.LIVE_LECTURE, liveLecture);
    await setItem('lms_fees', fees);
    await setItem('lms_bank', bankAccount);
    await setItem('lms_theme', theme);
  }, [groups, messages, pendingStudents, groupMembers, settings, profile, role, disabledStudents, students, liveLecture, fees, bankAccount, theme]);

  useEffect(() => {
    if (isReady) persist();
  }, [isReady, groups, messages, pendingStudents, groupMembers, settings, profile, role, disabledStudents, students, liveLecture, fees, bankAccount, theme]);

  const setRoleAndPersist = useCallback(async (r) => {
    setRole(r);
    await setItem(STORAGE_KEYS.ROLE, r);
  }, []);

  const addGroup = useCallback((name) => {
    const id = generateId();
    setGroups((prev) => [...prev, { id, name, createdAt: Date.now() }]);
    setGroupMembers((prev) => ({ ...prev, [id]: [] }));
    setMessages((prev) => ({ ...prev, [id]: [] }));
    setSettings((prev) => ({
      ...prev,
      [id]: { allowStudentMessages: true, allowMedia: true, allowPolls: true },
    }));
  }, []);

  const renameGroup = useCallback((groupId, newName) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g)));
  }, []);

  const deleteGroup = useCallback((groupId) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setGroupMembers((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
    setMessages((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
    setSettings((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  }, []);

  const updateGroupSettings = useCallback((groupId, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [groupId]: { ...(prev[groupId] || {}), [key]: value },
    }));
  }, []);

  const assignStudentToGroup = useCallback((studentId, groupId) => {
    const student = pendingStudents.find((s) => s.id === studentId) || students[studentId];
    if (!student) return;

    const newStudent = {
      id: student.id,
      name: student.name,
      phone: student.phone,
      avatar: student.avatar || null,
    };

    setStudents((prev) => ({ ...prev, [studentId]: newStudent }));

    setGroupMembers((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach(gid => {
        next[gid] = (next[gid] || []).filter(id => id !== studentId);
      });
      next[groupId] = [...(next[groupId] || []), studentId];
      return next;
    });

    setPendingStudents((prev) => prev.filter((s) => s.id !== studentId));
  }, [pendingStudents, students]);

  const addMessage = useCallback((groupId, msg) => {
    setMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), { ...msg, id: msg.id || generateId(), timestamp: msg.timestamp || Date.now() }],
    }));
  }, []);

  const broadcastMessage = useCallback((msg) => {
    setMessages((prev) => {
      const next = { ...prev };
      groups.forEach((g) => {
        next[g.id] = [
          ...(next[g.id] || []),
          { ...msg, id: generateId(), timestamp: Date.now() }
        ];
      });
      return next;
    });
  }, [groups]);

  const pinMessage = useCallback((groupId, messageId) => {
    setMessages((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).map((m) =>
        m.id === messageId ? { ...m, pinned: true } : { ...m, pinned: false }
      ),
    }));
  }, []);

  const votePoll = useCallback((groupId, messageId, optionId, voterId) => {
    setMessages((prev) => {
      const list = prev[groupId] || [];
      return {
        ...prev,
        [groupId]: list.map((m) => {
          if (m.id !== messageId || m.type !== 'poll') return m;
          const options = m.options.map((o) => {
            if (o.id !== optionId) return { ...o, votes: o.votes.filter((v) => v !== voterId) };
            if (o.votes.includes(voterId)) return o;
            return { ...o, votes: [...o.votes, voterId] };
          });
          return { ...m, options };
        }),
      };
    });
  }, []);

  const disableStudent = useCallback((studentId) => {
    setDisabledStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  }, []);

  const removeStudentFromGroup = useCallback((studentId, groupId) => {
    setGroupMembers((prev) => ({
      ...prev,
      [groupId]: (prev[groupId] || []).filter((id) => id !== studentId),
    }));
  }, []);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const collectFee = useCallback((studentId) => {
    setFees((prev) => {
      const studentFee = prev[studentId] || { amount: 0 };
      const updated = { ...prev, [studentId]: { ...studentFee, status: 'paid' } };
      setBankAccount(bank => ({ ...bank, balance: bank.balance + studentFee.amount }));
      return updated;
    });
  }, []);

  const sendFeeReminder = useCallback((studentId) => {
    const student = students[studentId];
    console.log(`Reminder sent to ${student?.name} for amount: ${fees[studentId]?.amount}`);
  }, [students, fees]);

  const updateBankDetails = useCallback((updates) => {
    setBankAccount(prev => ({ ...prev, ...updates }));
  }, []);

  const startLive = useCallback((groupId, link, title) => {
    setGroupLives(prev => ({
      ...prev,
      [groupId]: { active: true, link, title: title || 'Live Lecture' },
    }));
  }, []);

  const endLive = useCallback((groupId) => {
    setGroupLives(prev => ({
      ...prev,
      [groupId]: { active: false, link: '', title: '' },
    }));
  }, []);

  const payFee = useCallback((studentId, amount) => {
    setFees((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), status: 'paid' }
    }));
    setBankAccount(bank => ({ ...bank, balance: bank.balance + amount }));
  }, []);

  const value = {
    isReady,
    role,
    setRole: setRoleAndPersist,
    groups,
    messages,
    pendingStudents,
    groupMembers,
    students,
    settings,
    profile,
    disabledStudents,
    liveLecture,
    setLiveLecture,
    isTyping,
    simulateTyping,
    addGroup,
    renameGroup,
    deleteGroup,
    updateGroupSettings,
    assignStudentToGroup,
    addMessage,
    deleteMessage,
    broadcastMessage,
    pinMessage,
    votePoll,
    disableStudent,
    removeStudentFromGroup,
    updateProfile,
    fees,
    bankAccount,
    collectFee,
    sendFeeReminder,
    updateBankDetails,
    payFee,
    session,
    uploadFile,
    logout,
    trackLogin,
    recentLogins,
    theme,
    setTheme,
    groupLives,
    startLive,
    endLive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
