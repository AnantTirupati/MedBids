"use client";

import * as React from "react";
import { Notification } from "@/types";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children, userId = "p1" }: { children: React.ReactNode; userId?: string }) {
  const { notifications, markAsRead, clearAll, refresh } = useNotifications(userId);

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        clearAll,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useGlobalNotifications() {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useGlobalNotifications must be used within a NotificationProvider");
  }
  return context;
}
