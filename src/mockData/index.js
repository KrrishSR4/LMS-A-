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
export const DEFAULT_PENDING_STUDENTS = [
  { id: 'ps1', name: 'Rahul Sharma', phone: '+91 98765 43210', requestedAt: Date.now() - 3600000 },
  { id: 'ps2', name: 'Priya Singh', phone: '+91 87654 32109', requestedAt: Date.now() - 7200000 },
  { id: 'ps3', name: 'Amit Kumar', phone: '+91 76543 21098', requestedAt: Date.now() - 1800000 },
];

// Group members mapping: groupId -> [studentIds]
// current_user = demo student (when in Student mode)
export const DEFAULT_GROUP_MEMBERS = {
  g1: ['s1', 's2', 'current_user'],
  g2: ['s3', 's4', 'current_user'],
  g3: ['s5', 's6', 'current_user'],
};

// Student profiles (used across groups)
// current_user = logged-in student in demo mode
export const DEFAULT_STUDENTS = {
  current_user: { id: 'current_user', name: 'Demo Student', phone: '+91 99999 00000', avatar: null },
  s1: { id: 's1', name: 'Arjun Mehta', phone: '+91 99999 11111', avatar: null },
  s2: { id: 's2', name: 'Kavya Patel', phone: '+91 88888 22222', avatar: null },
  s3: { id: 's3', name: 'Vikram Reddy', phone: '+91 77777 33333', avatar: null },
  s4: { id: 's4', name: 'Neha Gupta', phone: '+91 66666 44444', avatar: null },
  s5: { id: 's5', name: 'Rohan Desai', phone: '+91 55555 55555', avatar: null },
  s6: { id: 's6', name: 'Ananya Iyer', phone: '+91 44444 66666', avatar: null },
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
  id: 'current_user',
  name: 'Demo Student',
  phone: '+91 99999 00000',
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
export const LIVE_LECTURE_BANNER = {
  active: true,
  title: 'Mathematics - Quadratic Equations',
  instructor: 'Prof. Rajesh Kumar',
  groupId: 'g3',
  link: 'https://meet.example.com/live',
  startedAt: Date.now() - 600000, // 10 min ago
};
