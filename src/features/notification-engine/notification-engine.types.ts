export interface NotificationPreference {
  userId: string;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  auctionAlertsEnabled: boolean;
  bidAlertsEnabled: boolean;
  reservationAlertsEnabled: boolean;
  marketingEnabled: boolean;
  maintenanceEnabled: boolean;
  quietHoursStart: string | null; // e.g. "22:00"
  quietHoursEnd: string | null;   // e.g. "08:00"
}

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: "web" | "ios" | "android";
  createdAt: string;
  lastUsedAt: string;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  titleTemplate: string;
  bodyTemplate: string;
  category: string;
  priority: "low" | "normal" | "high";
}

export interface NotificationLog {
  id: string;
  notificationId: string;
  userId: string;
  type: string;
  status: "created" | "delivered" | "read" | "archived" | "failed";
  channel: "in-app" | "push";
  error: string | null;
  timestamp: string;
}
