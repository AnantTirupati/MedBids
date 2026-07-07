import { NotificationRepository } from "./interfaces/notification.repository";
import { mockNotifications } from "@/lib/mock-data";
import { Notification } from "@/types";

export const notificationRepositoryMock: NotificationRepository = {
  async getNotifications(userId: string): Promise<Notification[]> {
    return mockNotifications.filter((n) => n.user_id === userId);
  },

  async getNotificationById(id: string): Promise<Notification | null> {
    const notif = mockNotifications.find((n) => n.id === id);
    return notif || null;
  },

  async updateNotification(notification: Notification): Promise<Notification> {
    const index = mockNotifications.findIndex((n) => n.id === notification.id);
    if (index !== -1) {
      mockNotifications[index] = {
        ...mockNotifications[index],
        ...notification,
      };
      return mockNotifications[index];
    }
    throw new Error("Notification not found");
  },

  async updateNotifications(notifications: Notification[]): Promise<Notification[]> {
    const updated: Notification[] = [];
    for (const notification of notifications) {
      const index = mockNotifications.findIndex((n) => n.id === notification.id);
      if (index !== -1) {
        mockNotifications[index] = {
          ...mockNotifications[index],
          ...notification,
        };
        updated.push(mockNotifications[index]);
      }
    }
    return updated;
  },

  async clearNotifications(userId: string): Promise<void> {
    let i = mockNotifications.length;
    while (i--) {
      if (mockNotifications[i].user_id === userId) {
        mockNotifications.splice(i, 1);
      }
    }
    notifyListeners(userId);
  },

  async createNotification(notification: Notification): Promise<Notification> {
    mockNotifications.push(notification);
    notifyListeners(notification.user_id);
    return notification;
  },

  async deleteNotification(id: string): Promise<void> {
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      const userId = mockNotifications[index].user_id;
      mockNotifications.splice(index, 1);
      notifyListeners(userId);
    }
  },

  subscribeNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    let list = userListeners.get(userId);
    if (!list) {
      list = new Set();
      userListeners.set(userId, list);
    }
    list.add(callback);
    callback(mockNotifications.filter((n) => n.user_id === userId));
    return () => {
      list?.delete(callback);
    };
  },
};

const userListeners: Map<string, Set<(notifications: Notification[]) => void>> = new Map();

function notifyListeners(userId: string) {
  const list = userListeners.get(userId);
  if (list) {
    const filtered = mockNotifications.filter((n) => n.user_id === userId);
    list.forEach((cb) => cb([...filtered]));
  }
}

export default notificationRepositoryMock;
