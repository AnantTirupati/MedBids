import { Notification } from "@/types";
import { notificationRepository } from "@/repositories";
import { getRandomDelay } from "@/utils/delay";

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await getRandomDelay();
    return notificationRepository.getNotifications(userId);
  },

  async markAsRead(id: string): Promise<void> {
    await getRandomDelay();
    const notif = await notificationRepository.getNotificationById(id);
    if (notif) {
      notif.is_read = true;
      await notificationRepository.updateNotification(notif);
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    await getRandomDelay();
    const notifs = await notificationRepository.getNotifications(userId);
    const updated = notifs.map((n) => ({ ...n, is_read: true }));
    await notificationRepository.updateNotifications(updated);
  },

  async clearAll(userId: string): Promise<void> {
    await getRandomDelay();
    await notificationRepository.clearNotifications(userId);
  },

  async deleteNotification(id: string): Promise<void> {
    await getRandomDelay();
    await notificationRepository.deleteNotification(id);
  },

  subscribeNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    return notificationRepository.subscribeNotifications(userId, callback);
  },
};

export default notificationService;
