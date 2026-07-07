import * as React from "react";
import { PlatformSettings } from "@/types";
import { settingsService } from "@/services/settings.service";

export function usePlatformSettings() {
  const [settings, setSettings] = React.useState<PlatformSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const unsubscribe = settingsService.subscribeSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: PlatformSettings, adminId: string) => {
    try {
      setLoading(true);
      await settingsService.updateSettings(newSettings, adminId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update settings"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
  };
}

export default usePlatformSettings;
