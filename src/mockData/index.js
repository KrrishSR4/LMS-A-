/**
 * Mock data for LMS demo - no backend required.
 * Ready to replace with API calls when integrating backend.
 */

import { generateId } from '../utils/helpers';

// Default groups for coaching institute
export const DEFAULT_GROUPS = [
  { id: 'g1', name: 'Class 8', createdAt: Date.now() - 86400000 * 30 },
  { id: 'g2', name: 'Class 9', createdAt: Date.now() - 86400000 * 20 },
  { id: 'g3', name: 'Class 10', createdAt: Date.now() - 86400000 * 10 },
];

// Pending students awaiting group assignment
export const DEFAULT_PENDING_STUDENTS = [];

// Group members mapping: groupId -> [studentIds]
export const DEFAULT_GROUP_MEMBERS = {
  g1: [],
  g2: [],
  g3: [],
};

// Student profiles (used across groups)
export const DEFAULT_STUDENTS = {
  // current_user: { id: 'current_user', name: 'Demo Student', phone: '+91 99999 00000', avatar: null },
};

// Default group settings
export const getDefaultGroupSettings = (groupId) => ({
  [groupId]: {
    allowStudentMessages: true,
    allowMedia: true,
    allowPolls: true,
  },
});

// Current user profile (when in Student mode)
export const DEFAULT_PROFILE = {
  id: 'temp_user',
  name: 'Student',
  phone: '',
  email: '',
  avatar: null,
};

// Sample initial messages per group (for demo)
export const getInitialMessages = () => {
  const now = Date.now();
  const hour = 3600000;
  const day = 86400000;

  return {
    g1: [
      {
        id: generateId(),
        type: 'announcement',
        senderId: 'admin',
        senderName: 'Admin',
        text: 'Welcome to Class 8! Please introduce yourself.',
        timestamp: now - day * 2,
        pinned: true,
      },
      {
        id: generateId(),
        type: 'text',
        senderId: 's1',
        senderName: 'Arjun Mehta',
        text: 'Hi everyone! I am Arjun.',
        timestamp: now - day * 2 + hour,
      },
      {
        id: generateId(),
        type: 'text',
        senderId: 'admin',
        senderName: 'Admin',
        text: 'Great, Arjun!',
        timestamp: now - day,
      },
    ],
    g2: [
      {
        id: generateId(),
        type: 'announcement',
        senderId: 'admin',
        senderName: 'Admin',
        text: 'Class 9 syllabus for this month is now available.',
        timestamp: now - day,
        pinned: true,
      },
    ],
    g3: [
      {
        id: generateId(),
        type: 'announcement',
        senderId: 'admin',
        senderName: 'Admin',
        text: 'Board exam preparation starts next week. Stay tuned!',
        timestamp: now - day,
        pinned: true,
      },
      {
        id: generateId(),
        type: 'poll',
        senderId: 'admin',
        senderName: 'Admin',
        question: 'Preferred revision slot?',
        options: [
          { id: 'o1', text: 'Morning 7-9 AM', votes: [] },
          { id: 'o2', text: 'Evening 5-7 PM', votes: [] },
          { id: 'o3', text: 'Night 8-10 PM', votes: [] },
        ],
        timestamp: now - hour * 2,
      },
    ],
  };
};

// Live lecture banner mock
export const THEMES = {
  indigo: {
    id: 'indigo',
    name: 'Indigo Classic',
    primary: '#2563eb',
    secondary: '#dbeafe',
    text: '#1e293b',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Clean',
    primary: '#10b981',
    secondary: '#d1fae5',
    text: '#064e3b',
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    primary: '#f43f5e',
    secondary: '#ffe4e6',
    text: '#881337',
  },
  amber: {
    id: 'amber',
    name: 'Amber Gold',
    primary: '#f59e0b',
    secondary: '#fef3c7',
    text: '#78350f',
  },
  violet: {
    id: 'violet',
    name: 'Deep Violet',
    primary: '#8b5cf6',
    secondary: '#ede9fe',
    text: '#4c1d95',
  },
};

export const LIVE_LECTURE_BANNER = {
  active: true,
  title: 'Mathematics - Quadratic Equations',
  instructor: 'Prof. Rajesh Kumar',
  groupId: 'g3',
  link: 'https://meet.example.com/live',
  startedAt: Date.now() - 600000, // 10 min ago
};
