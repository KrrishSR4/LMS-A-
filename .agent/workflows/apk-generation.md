---
description: How to generate an APK for the LMS Expo app
---

To generate an APK for Android using Expo EAS (Expo Application Services), follow these steps:

1. **Install EAS CLI** (if not already installed):
```bash
npm install -g eas-cli
```

2. **Login to your Expo account**:
```bash
eas login
```

3. **Configure the project** (I have already created `eas.json` for you):
```bash
eas build:configure
```

4. **Run the build command for APK**:
```bash
eas build -p android --profile preview
```

### Note on Build Types:
- **preview**: This will generate an `.apk` file that you can install directly on your Android phone.
- **production**: This will generate an `.aab` (Android App Bundle) which is required for submitting to the Google Play Store.

After running the build command, you will get a link to the Expo Dashboard where you can monitor the progress and download the APK once it's finished.
