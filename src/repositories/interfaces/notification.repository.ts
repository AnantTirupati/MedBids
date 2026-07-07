import { Notification } from "@/types";

export interface NotificationRepository {
  getNotifications(userId: string): Promise<Notification[]>;
  getNotificationById(id: string): Promise<Notification | null>;
  updateNotification(notification: Notification): Promise<Notification>;
  updateNotifications(notifications: Notification[]): Promise<Notification[]>;
  createNotification(notification: Notification): Promise<Notification>;
  deleteNotification(id: string): Promise<void>;
  clearNotifications(userId: string): Promise<void>;
  subscribeNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void;
}
