import { DeviceTokenRepository } from "@/features/notification-engine/notification-engine.repository";
import { DeviceToken } from "@/features/notification-engine/notification-engine.types";
import { db, createConverter } from "@/lib/firebase/firestore";
import { doc, getDocs, collection, query, where, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

const COLLECTION_NAME = "device_tokens";

export const deviceTokenRepositoryFirebase: DeviceTokenRepository = {
  async registerDevice(token: DeviceToken): Promise<DeviceToken> {
    try {
      const docRef = doc(db, COLLECTION_NAME, token.id).withConverter(createConverter<DeviceToken>());
      await setDoc(docRef, token, { merge: true });
      return token;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async removeDevice(userId: string, token: string): Promise<void> {
    try {
      const colRef = collection(db, COLLECTION_NAME).withConverter(createConverter<DeviceToken>());
      const q = query(colRef, where("userId", "==", userId), where("token", "==", token));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, COLLECTION_NAME, d.id));
      }
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getUserDevices(userId: string): Promise<DeviceToken[]> {
    try {
      const colRef = collection(db, COLLECTION_NAME).withConverter(createConverter<DeviceToken>());
      const q = query(colRef, where("userId", "==", userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeUserDevices(userId: string, callback: (tokens: DeviceToken[]) => void): () => void {
    const colRef = collection(db, COLLECTION_NAME).withConverter(createConverter<DeviceToken>());
    const q = query(colRef, where("userId", "==", userId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default deviceTokenRepositoryFirebase;
