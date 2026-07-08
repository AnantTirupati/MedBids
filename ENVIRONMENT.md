# Environment Variables Configuration

This document lists the configurations used by MedBids at runtime.

---

## Environment Keys

```env
# Toggle between "mock" data and real "firebase" backend
NEXT_PUBLIC_USE_FIREBASE=firebase

# Firebase Config Keys
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Validation
A validation utility `validateEnv` runs on layout initialization to warn developers about missing properties, ensuring setup problems are caught immediately.
