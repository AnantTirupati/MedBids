import { NotificationRepository } from "./interfaces/notification.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Notification } from "@/types";
import { doc, getDoc, getDocs, collection, query, where, setDoc, deleteDoc, onSnapshot, orderBy } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";
import { firestoreBatch } from "@/lib/firebase/batch";

export const notificationRepositoryFirebase: NotificationRepository = {
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const colRef = collection(db, Collections.NOTIFICATIONS).withConverter(createConverter<Notification>());
      const q = query(colRef, where("user_id", "==", userId), orderBy("created_at", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      const docRef = doc(db, Collections.NOTIFICATIONS, id).withConverter(createConverter<Notification>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateNotification(notification: Notification): Promise<Notification> {
    try {
      const docRef = doc(db, Collections.NOTIFICATIONS, notification.id).withConverter(createConverter<Notification>());
      await setDoc(docRef, notification, { merge: true });
      return notification;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateNotifications(notifications: Notification[]): Promise<Notification[]> {
    try {
      const batch = firestoreBatch.create();
      for (const notif of notifications) {
        batch.update(Collections.NOTIFICATIONS, notif.id, notif as unknown as Record<string, unknown>);
      }
      await batch.commit();
      return notifications;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async clearNotifications(userId: string): Promise<void> {
    try {
      const colRef = collection(db, Collections.NOTIFICATIONS);
      const q = query(colRef, where("user_id", "==", userId));
      const snap = await getDocs(q);

      const batch = firestoreBatch.create();
      for (const d of snap.docs) {
        batch.delete(Collections.NOTIFICATIONS, d.id);
      }
      await batch.commit();
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createNotification(notification: Notification): Promise<Notification> {
    try {
      const docRef = doc(db, Collections.NOTIFICATIONS, notification.id).withConverter(createConverter<Notification>());
      await setDoc(docRef, notification);
      return notification;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async deleteNotification(id: string): Promise<void> {
    try {
      const docRef = doc(db, Collections.NOTIFICATIONS, id);
      await deleteDoc(docRef);
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const colRef = collection(db, Collections.NOTIFICATIONS).withConverter(createConverter<Notification>());
    const q = query(colRef, where("user_id", "==", userId), orderBy("created_at", "desc"));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default notificationRepositoryFirebase;
