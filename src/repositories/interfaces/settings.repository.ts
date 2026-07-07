import { PlatformSettings } from "@/types";

export interface SettingsRepository {
  getPlatformSettings(): Promise<PlatformSettings>;
  updatePlatformSettings(settings: PlatformSettings): Promise<PlatformSettings>;
  subscribePlatformSettings(callback: (settings: PlatformSettings) => void): () => void;
}
