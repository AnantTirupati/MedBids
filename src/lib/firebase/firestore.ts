import {
  getFirestore,
  connectFirestoreEmulator,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { app } from "./client";

const db = getFirestore(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  const host = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST || "localhost";
  const port = parseInt(process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT || "8080", 10);
  connectFirestoreEmulator(db, host, port);
}

// Helper to recursively convert Firestore Timestamps to ISO strings
export function convertTimestamps<T>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T;

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString() as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps) as unknown as T;
  }

  if (typeof obj === "object" && obj !== null && !(obj instanceof Date)) {
    const newObj: Record<string, unknown> = {};
    const record = obj as Record<string, unknown>;
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        newObj[key] = convertTimestamps(record[key]);
      }
    }
    return newObj as T;
  }

  return obj as T;
}

// Helper to recursively convert Date ISO strings to Timestamps
export function prepareForFirestore(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(obj)) {
    return Timestamp.fromDate(new Date(obj));
  }

  if (Array.isArray(obj)) {
    return obj.map(prepareForFirestore);
  }

  if (typeof obj === "object" && obj !== null && !(obj instanceof Date) && !(obj instanceof Timestamp)) {
    const newObj: Record<string, unknown> = {};
    const record = obj as Record<string, unknown>;
    for (const key in record) {
      if (Object.prototype.hasOwnProperty.call(record, key)) {
        newObj[key] = prepareForFirestore(record[key]);
      }
    }
    return newObj;
  }

  return obj;
}

// Generic Firestore Data Converter with timestamp/ISO conversion built-in
export function createConverter<T extends object>(): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: T): DocumentData {
      return prepareForFirestore(modelObject) as DocumentData;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      const data = snapshot.data(options);
      return convertTimestamps<T>(data);
    },
  };
}

export { db };
export default db;
