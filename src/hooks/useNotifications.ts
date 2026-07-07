"use client";

import * as React from "react";
import { Notification } from "@/types";
import { notificationService } from "@/services/notification.service";

export function useNotifications(userId: string) {
  const [loading, setLoading] = React.useState(!!userId);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = notificationService.subscribeNotifications(userId, (data) => {
      setNotifications(data);
      setLoading(false);
      setSuccess(true);
    });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Mark read failed"));
      throw err;
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAll(userId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Clear notifications failed"));
      throw err;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Delete notification failed"));
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Mark all read failed"));
      throw err;
    }
  };

  return {
    loading,
    error,
    success,
    notifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
    refresh: async () => {},
  };
}

export default useNotifications;
