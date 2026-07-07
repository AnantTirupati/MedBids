import { NotificationPreferenceRepository } from "@/features/notification-engine/notification-engine.repository";
import { NotificationPreference } from "@/features/notification-engine/notification-engine.types";
import { db, createConverter } from "@/lib/firebase/firestore";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

const COLLECTION_NAME = "notification_preferences";

function getDefaultPrefs(userId: string): NotificationPreference {
  return {
    userId,
    pushEnabled: true,
    inAppEnabled: true,
    auctionAlertsEnabled: true,
    bidAlertsEnabled: true,
    reservationAlertsEnabled: true,
    marketingEnabled: false,
    maintenanceEnabled: true,
    quietHoursStart: null,
    quietHoursEnd: null,
  };
}

export const notificationPreferenceRepositoryFirebase: NotificationPreferenceRepository = {
  async getPreferences(userId: string): Promise<NotificationPreference> {
    try {
      const docRef = doc(db, COLLECTION_NAME, userId).withConverter(createConverter<NotificationPreference>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : getDefaultPrefs(userId);
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updatePreferences(prefs: NotificationPreference): Promise<NotificationPreference> {
    try {
      const docRef = doc(db, COLLECTION_NAME, prefs.userId).withConverter(createConverter<NotificationPreference>());
      await setDoc(docRef, prefs, { merge: true });
      return prefs;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribePreferences(userId: string, callback: (prefs: NotificationPreference) => void): () => void {
    const docRef = doc(db, COLLECTION_NAME, userId).withConverter(createConverter<NotificationPreference>());
    return onSnapshot(docRef, (snap) => {
      callback(snap.exists() ? snap.data() : getDefaultPrefs(userId));
    });
  },
};

export default notificationPreferenceRepositoryFirebase;
