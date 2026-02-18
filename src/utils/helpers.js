/**
 * Utility helpers for the LMS app.
 * Ready for backend integration - timestamps, IDs can be replaced with server values.
 */

/**
 * Generate a simple unique ID for mock data.
 * Replace with UUID or server-generated ID when integrating backend.
 */
export const generateId = () => {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Format timestamp for display in chat.
 */
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 604800000) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  return date.toLocaleDateString();
};

/**
 * Check if two timestamps are on different days (for date separators).
 */
export const isNewDay = (prevTimestamp, currentTimestamp) => {
  if (!prevTimestamp) return true;
  const prev = new Date(prevTimestamp);
  const curr = new Date(currentTimestamp);
  return prev.getDate() !== curr.getDate() || prev.getMonth() !== curr.getMonth();
};

/**
 * Format full date for separators.
 */
export const formatDateSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};
