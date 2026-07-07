import * as React from "react";
import { DeviceToken } from "@/features/notification-engine/notification-engine.types";
import { deviceTokenRepository } from "@/repositories";

export function usePushNotifications(userId: string) {
  const [tokens, setTokens] = React.useState<DeviceToken[]>([]);
  const [permission, setPermission] = React.useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  React.useEffect(() => {
    if (!userId) return;
    const unsub = deviceTokenRepository.subscribeUserDevices(userId, (data) => {
      setTokens(data);
    });

    return () => unsub();
  }, [userId]);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  };

  const registerDevice = async (token: string, platform: DeviceToken["platform"] = "web") => {
    const device: DeviceToken = {
      id: `dev_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      token,
      platform,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };
    await deviceTokenRepository.registerDevice(device);
  };

  const removeDevice = async (token: string) => {
    await deviceTokenRepository.removeDevice(userId, token);
  };

  return {
    tokens,
    permission,
    requestPermission,
    registerDevice,
    removeDevice,
  };
}

export default usePushNotifications;
