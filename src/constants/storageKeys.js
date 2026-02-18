/**
 * AsyncStorage keys for session-like persistence.
 * Data is cleared on app reload to simulate session behavior.
 */
export const STORAGE_KEYS = {
  GROUPS: '@lms_groups',
  MESSAGES: '@lms_messages',
  PENDING_STUDENTS: '@lms_pending_students',
  GROUP_MEMBERS: '@lms_group_members',
  SETTINGS: '@lms_settings',
  PROFILE: '@lms_profile',
  ROLE: '@lms_role',
  DISABLED_STUDENTS: '@lms_disabled_students',
  STUDENTS: '@lms_students',
  LIVE_LECTURE: '@lms_live_lecture',
};
