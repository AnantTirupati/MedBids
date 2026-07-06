import { Notification } from "@/types";
import { mockNotifications } from "@/lib/mock-data";
import { getRandomDelay } from "@/utils/delay";

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await getRandomDelay();
    return mockNotifications.filter((n) => n.user_id === userId);
  },

  async markAsRead(id: string): Promise<void> {
    await getRandomDelay();
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    await getRandomDelay();
    mockNotifications
      .filter((n) => n.user_id === userId)
      .forEach((n) => {
        n.is_read = true;
      });
  },

  async clearAll(userId: string): Promise<void> {
    await getRandomDelay();
    // Simulate clearing by mutating the data array contents
    const index = mockNotifications.findIndex((n) => n.user_id === userId);
    if (index !== -1) {
      mockNotifications.splice(0, mockNotifications.length);
    }
  },
};

export default notificationService;
