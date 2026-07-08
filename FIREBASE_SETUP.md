# Firebase Setup & Local Emulators Configuration

This document covers configuring the Firebase project and local emulators.

---

## 1. Firebase Console Configuration
1. Create a new Firebase project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Phone provider).
3. Enable **Cloud Firestore** in production mode.
4. Enable **Cloud Storage**.
5. Register a Web App and copy the config variables.

---

## 2. Deploy Configuration
Deploy rules and indexes using Firebase CLI:
```bash
# Login to Firebase
firebase login

# Use project
firebase use <project-id>

# Deploy Rules & Indexes
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

---

## 3. Local Emulator Suite
Launch emulators locally to prevent any queries from reaching production during development:
```bash
# Start emulator suite
firebase emulators:start
```
The suite runs on `http://localhost:4000/`.
