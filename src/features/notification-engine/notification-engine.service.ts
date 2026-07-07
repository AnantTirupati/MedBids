import { notificationRepository, notificationPreferenceRepository, deviceTokenRepository } from "@/repositories";
import { Notification, NotificationType } from "@/types";
import { notificationUtils } from "./notification-engine.utils";
import { notificationEvents } from "./notification-engine.events";

export const notificationEngineService = {
  async sendNotification(
    userId: string,
    type: string,
    titleTemplate: string,
    bodyTemplate: string,
    params: Record<string, string>,
    category: string,
    priority: "low" | "normal" | "high" = "normal",
    actionUrl: string | null = null
  ): Promise<void> {
    const prefs = await notificationPreferenceRepository.getPreferences(userId);
    const title = notificationUtils.formatTemplate(titleTemplate, params);
    const message = notificationUtils.formatTemplate(bodyTemplate, params);

    // 1. In-App Notification channel
    if (prefs.inAppEnabled) {
      const notif: Notification = {
        id: `notif_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        type: type as NotificationType,
        title,
        message,
        is_read: false,
        action_url: actionUrl,
        created_at: new Date().toISOString(),
      };
      await notificationRepository.createNotification(notif);
      notificationEvents.logStatus(notif.id, userId, type, "created", "in-app");
      notificationEvents.logStatus(notif.id, userId, type, "delivered", "in-app");
    }

    // 2. FCM Push Notification channel
    if (prefs.pushEnabled && !notificationUtils.isQuietHours(prefs.quietHoursStart, prefs.quietHoursEnd)) {
      const devices = await deviceTokenRepository.getUserDevices(userId);
      if (devices.length > 0) {
        for (const device of devices) {
          console.log(`[FCM Push] Sending push message to device ${device.token} (${device.platform}): Title: "${title}" | Message: "${message}"`);
          notificationEvents.logStatus(`push_${device.id}`, userId, type, "delivered", "push");
        }
      } else {
        console.log(`[FCM Push] No registered device tokens found for user ${userId}`);
      }
    }
  },
};

export default notificationEngineService;
