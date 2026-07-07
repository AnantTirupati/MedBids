import * as React from "react";
import { NotificationPreference } from "@/features/notification-engine/notification-engine.types";
import { notificationPreferenceRepository } from "@/repositories";

export function useNotificationPreferences(userId: string) {
  const [preferences, setPreferences] = React.useState<NotificationPreference | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!userId) return;
    const unsub = notificationPreferenceRepository.subscribePreferences(userId, (data) => {
      setPreferences(data);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  const updatePreferences = async (newPrefs: NotificationPreference) => {
    try {
      setLoading(true);
      await notificationPreferenceRepository.updatePreferences(newPrefs);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update preferences"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
  };
}

export default useNotificationPreferences;
