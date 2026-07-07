import { NotificationLog } from "./notification-engine.types";

export const notificationEvents = {
  logStatus(
    notificationId: string,
    userId: string,
    type: string,
    status: NotificationLog["status"],
    channel: NotificationLog["channel"],
    error: string | null = null
  ): NotificationLog {
    const log: NotificationLog = {
      id: `nl_${Math.random().toString(36).substr(2, 9)}`,
      notificationId,
      userId,
      type,
      status,
      channel,
      error,
      timestamp: new Date().toISOString(),
    };
    console.log(`[NotificationEvent] [${log.timestamp}] Notif: ${notificationId} | User: ${userId} | Type: ${type} | Status: ${status} | Channel: ${channel}${error ? ` | Error: ${error}` : ""}`);
    return log;
  },
};

export default notificationEvents;
