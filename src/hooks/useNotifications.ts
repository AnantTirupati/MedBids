"use client";

import * as React from "react";
import { Notification } from "@/types";
import { notificationService } from "@/services/notification.service";

export function useNotifications(userId: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await notificationService.getNotifications(userId);
      setNotifications(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load notifications"));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Mark read failed"));
      throw err;
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAll(userId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Clear notifications failed"));
      throw err;
    }
  };

  return {
    loading,
    error,
    success,
    notifications,
    markAsRead,
    clearAll,
    refresh: loadData,
  };
}

export default useNotifications;
