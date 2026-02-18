# LMS Expo - Coaching Institute Learning Management System

A fully interactive LMS mobile app prototype built with React Native and Expo. Runs in **Expo Go** with no backend required.

## Features

### Entry
- **Enter as Admin** or **Enter as Student** (Demo Mode) — switches UI role only

### Admin
- **Dashboard**: Total students, groups, pending count; quick links
- **Student Approval**: Assign pending students to groups
- **Group Management**: Create, rename, delete groups
- **Group Settings**: Toggle student messages, media, polls
- **Group Chat**: Send text, announcements, polls, image/PDF previews, voice notes, lecture links
- **Student Control**: Disable/enable student, remove from group

### Student
- **Dashboard**: Joined groups, live lecture banner, announcements
- **Group Chat**: Send messages (when allowed), vote in polls, view attachments
- **Profile**: Edit name, phone, profile image (preview)
- **Group Info**: Classmates list, rules

## Storage

Uses **AsyncStorage** for session-like persistence:
- Data persists while the app is open
- Cleared automatically on app reload (simulates new session)
- Ready to replace with API calls for backend integration

## Run

```bash
npm install
npx expo start
```

Scan QR code with Expo Go (Android/iOS) to run.

## Project Structure

```
src/
├── components/       # Reusable UI (Card, Button, LoadingSpinner)
├── components/chat/  # Chat UI (MessageBubble, PollBubble, ChatInput, etc.)
├── context/          # AppContext (state + AsyncStorage)
├── constants/        # Storage keys
├── mockData/         # Mock JSON data
├── navigation/       # React Navigation (Stack + Tabs)
├── screens/          # Admin & Student screens
└── utils/            # Storage, helpers
```

## Tech Stack

- React Native + Expo
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage
- Mock data only — no API, auth, or database


let i = 0;
while (i < 10) {
  console.log(i);
  i++;
}
    console.log("studentDashboard")
 console.log("adminDashboard")
 console.write("property")
 property.callStack() {
    if property name === console
    console.log("property is console)
    else
    console.log("property is not console)

 }

 