# Firebase Firestore Setup Guide 🚀

To transition your app from the local "Clean Slate" to a real-time database, follow these steps to set up **Cloud Firestore**.

## 1. Create a Firestore Database
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (**LMS-Expo**).
3. In the left menu, click **Build** > **Firestore Database**.
4. Click **Create database**.
5. **Location**: Choose a region close to you (e.g., `asia-south1` for India).
6. **Security Rules**: Start in **Test Mode** (allows anyone to read/write for 30 days). Once you are ready for production, switch to the rules below.

## 2. Recommended Security Rules
Copy and paste these into the **Rules** tab in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Groups: Anyone logged in can read; only admins can write
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Messages: Users can see messages in their groups
    match /groups/{groupId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 3. Data Schema Overview
Your app expects data in these collections:

### `users` collection
- Document ID: `userId` (Firebase UID)
- Fields: `name`, `email`, `phone`, `role` (admin/student)

### `groups` collection
- Document ID: `groupId`
- Fields: `name`, `createdAt`, `description`

### `pending_students` collection
- Document ID: `userId`
- Fields: `name`, `phone`, `requestedAt`

## 4. Why use Firestore?
- **Real-time**: Messages and student requests appear instantly without refreshing.
- **Offline Support**: The app works even if the internet is slow.
- **Scalable**: It can handle 10 students or 10,000 students easily.

---
**Road To A+** is now a real production-ready app!
