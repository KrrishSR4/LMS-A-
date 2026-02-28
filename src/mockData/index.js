/**
 * Mock data for LMS demo - no backend required.
 * Ready to replace with API calls when integrating backend.
 */

import { generateId } from '../utils/helpers';

// Default groups for coaching institute
export const DEFAULT_GROUPS = [];

// Pending students awaiting group assignment
export const DEFAULT_PENDING_STUDENTS = [];

// Group members mapping: groupId -> [studentIds]
export const DEFAULT_GROUP_MEMBERS = {};

// Student profiles (used across groups)
export const DEFAULT_STUDENTS = {};

// Default group settings
export const getDefaultGroupSettings = (groupId) => ({});

// Current user profile (when in Student mode)
export const DEFAULT_PROFILE = {
  id: '',
  name: '',
  phone: '',
  email: '',
  avatar: null,
};

// Sample initial messages per group (for demo)
export const getInitialMessages = () => ({});

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
  crimson: {
    id: 'crimson',
    name: 'Crimson Red',
    primary: '#be123c',
    secondary: '#fff1f2',
    text: '#4c0519',
  },
  teal: {
    id: 'teal',
    name: 'Ocean Teal',
    primary: '#0d9488',
    secondary: '#f0fdfa',
    text: '#134e4a',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#ea580c',
    secondary: '#fff7ed',
    text: '#7c2d12',
  },
};

export const LIVE_LECTURE_BANNER = {
  active: false,
  title: '',
  instructor: '',
  groupId: '',
  link: '',
  startedAt: 0,
};
