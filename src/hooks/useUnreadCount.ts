import * as React from "react";
import { notificationService } from "@/services/notification.service";

export function useUnreadCount(userId: string) {
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!userId) return;
    const unsub = notificationService.subscribeNotifications(userId, (data) => {
      const count = data.filter((n) => !n.is_read).length;
      setUnreadCount(count);
    });
    return () => unsub();
  }, [userId]);

  return { unreadCount };
}

export default useUnreadCount;
