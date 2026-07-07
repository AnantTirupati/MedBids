import { SettingsRepository } from "./interfaces/settings.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { PlatformSettings } from "@/types";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const settingsRepositoryFirebase: SettingsRepository = {
  async getPlatformSettings(): Promise<PlatformSettings> {
    try {
      const docRef = doc(db, Collections.SETTINGS, "platform").withConverter(createConverter<PlatformSettings>());
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data();
      }
      return {
        commissionRate: 0.05,
        auctionDurationHours: 24,
        maxBidsPerAuction: 50,
        minTimeLeftToExtendMinutes: 5,
      };
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updatePlatformSettings(settings: PlatformSettings): Promise<PlatformSettings> {
    try {
      const docRef = doc(db, Collections.SETTINGS, "platform").withConverter(createConverter<PlatformSettings>());
      await setDoc(docRef, settings, { merge: true });
      return settings;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribePlatformSettings(callback: (settings: PlatformSettings) => void): () => void {
    const docRef = doc(db, Collections.SETTINGS, "platform").withConverter(createConverter<PlatformSettings>());
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      } else {
        callback({
          commissionRate: 0.05,
          auctionDurationHours: 24,
          maxBidsPerAuction: 50,
          minTimeLeftToExtendMinutes: 5,
        });
      }
    });
  },
};

export default settingsRepositoryFirebase;
