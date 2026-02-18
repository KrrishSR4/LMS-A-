/**
 * App context - manages all LMS state with AsyncStorage persistence.
 * Simulates session: clear on app reload, persist during session.
 * Ready for backend: replace storage calls with API calls.
 */
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
} from '../mockData';
import { generateId } from '../utils/helpers';

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

  // Initialize: load from storage or use mock data
  useEffect(() => {
    const init = async () => {
      // NOTE: For demo purposes, we can choose to clear or keep. 
      // Let's change it to LOAD if exists, otherwise use defaults.
      const storedGroups = await getItem(STORAGE_KEYS.GROUPS);
      const storedMessages = await getItem(STORAGE_KEYS.MESSAGES);
      const storedPending = await getItem(STORAGE_KEYS.PENDING_STUDENTS);
      const storedMembers = await getItem(STORAGE_KEYS.GROUP_MEMBERS);
      const storedStudents = await getItem(STORAGE_KEYS.STUDENTS);
      const storedRole = await getItem(STORAGE_KEYS.ROLE);
      const storedSettings = await getItem(STORAGE_KEYS.SETTINGS);
      const storedLiveLecture = await getItem(STORAGE_KEYS.LIVE_LECTURE);

      setGroups(storedGroups || [...DEFAULT_GROUPS]);
      setPendingStudents(storedPending || [...DEFAULT_PENDING_STUDENTS]);
      setGroupMembers(storedMembers || { ...DEFAULT_GROUP_MEMBERS });
      setStudents(storedStudents || { ...DEFAULT_STUDENTS, current_user: { ...DEFAULT_PROFILE } });
      setMessages(storedMessages || getInitialMessages());

      if (storedSettings) {
        setSettings(storedSettings);
      } else {
        setSettings(
          Object.fromEntries(DEFAULT_GROUPS.map((g) => [g.id, getDefaultGroupSettings(g.id)[g.id]]))
        );
      }

      setRole(storedRole || 'student');
      setProfile({ ...DEFAULT_PROFILE });
      setLiveLecture(storedLiveLecture || { ...LIVE_LECTURE_BANNER });
      setIsReady(true);
    };
    init();
  }, []);

  // Simulate typing indicator
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

  // Persist state changes to AsyncStorage (session-like)
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
  }, [groups, messages, pendingStudents, groupMembers, settings, profile, role, disabledStudents, students, liveLecture]);

  useEffect(() => {
    if (isReady) persist();
  }, [isReady, groups, messages, pendingStudents, groupMembers, settings, profile, role, disabledStudents, students, liveLecture]);

  // Role
  const setRoleAndPersist = useCallback((r) => {
    setRole(r);
  }, []);

  // Groups
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

  // Group settings
  const updateGroupSettings = useCallback((groupId, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [groupId]: { ...(prev[groupId] || {}), [key]: value },
    }));
  }, []);

  // Student approval - Enforce One Student : One Group
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
      // Remove student from ALL groups first (Exclusivity Rule)
      Object.keys(next).forEach(gid => {
        next[gid] = (next[gid] || []).filter(id => id !== studentId);
      });
      // Add to the new target group
      next[groupId] = [...(next[groupId] || []), studentId];
      return next;
    });

    setPendingStudents((prev) => prev.filter((s) => s.id !== studentId));
  }, [pendingStudents, students]);

  // Messages
  const addMessage = useCallback((groupId, msg) => {
    setMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), { ...msg, id: msg.id || generateId(), timestamp: msg.timestamp || Date.now() }],
    }));
  }, []);

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
          // Remove vote from other options
          return { ...m, options };
        }),
      };
    });
  }, []);

  // Student control
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

  // Profile (student)
  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
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
    pinMessage,
    votePoll,
    disableStudent,
    removeStudentFromGroup,
    updateProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
