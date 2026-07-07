import { NotificationPreference, DeviceToken } from "./notification-engine.types";

export interface NotificationPreferenceRepository {
  getPreferences(userId: string): Promise<NotificationPreference>;
  updatePreferences(prefs: NotificationPreference): Promise<NotificationPreference>;
  subscribePreferences(userId: string, callback: (prefs: NotificationPreference) => void): () => void;
}

export interface DeviceTokenRepository {
  registerDevice(token: DeviceToken): Promise<DeviceToken>;
  removeDevice(userId: string, token: string): Promise<void>;
  getUserDevices(userId: string): Promise<DeviceToken[]>;
  subscribeUserDevices(userId: string, callback: (tokens: DeviceToken[]) => void): () => void;
}
