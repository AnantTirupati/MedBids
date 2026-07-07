import { NotificationPreferenceRepository } from "@/features/notification-engine/notification-engine.repository";
import { NotificationPreference } from "@/features/notification-engine/notification-engine.types";

const mockPrefs: Map<string, NotificationPreference> = new Map();
const listeners: Map<string, Set<(prefs: NotificationPreference) => void>> = new Map();

function getOrCreatePrefs(userId: string): NotificationPreference {
  let pref = mockPrefs.get(userId);
  if (!pref) {
    pref = {
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
    mockPrefs.set(userId, pref);
  }
  return pref;
}

export const notificationPreferenceRepositoryMock: NotificationPreferenceRepository = {
  async getPreferences(userId: string): Promise<NotificationPreference> {
    return getOrCreatePrefs(userId);
  },

  async updatePreferences(prefs: NotificationPreference): Promise<NotificationPreference> {
    mockPrefs.set(prefs.userId, prefs);
    const set = listeners.get(prefs.userId);
    if (set) {
      set.forEach((cb) => cb({ ...prefs }));
    }
    return prefs;
  },

  subscribePreferences(userId: string, callback: (prefs: NotificationPreference) => void): () => void {
    let set = listeners.get(userId);
    if (!set) {
      set = new Set();
      listeners.set(userId, set);
    }
    set.add(callback);
    callback(getOrCreatePrefs(userId));
    return () => {
      set?.delete(callback);
    };
  },
};

export default notificationPreferenceRepositoryMock;
